package com.donkie.quickcart.user.infra.integration.keycloak;

import com.donkie.quickcart.user.domain.model.UserRole;
import com.donkie.quickcart.user.infra.integration.keycloak.model.KeycloakUserData;
import com.donkie.quickcart.user.infra.integration.keycloak.model.UserRegistrationRequest;
import com.donkie.quickcart.user.infra.integration.keycloak.model.UserRoleData;
import io.github.resilience4j.bulkhead.annotation.Bulkhead;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import jakarta.ws.rs.core.Response;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RoleResource;
import org.keycloak.admin.client.resource.RolesResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Client for interacting with Keycloak Admin API using the Keycloak Admin Client.
 */
@Component
@Slf4j
@AllArgsConstructor
public class KeycloakClient {

    private final Keycloak keycloakAdminClient;
    private final KeycloakProperties keycloakProperties;

    private UsersResource usersResource() {
        return keycloakAdminClient.realm(keycloakProperties.getRealm()).users();
    }

    private RolesResource rolesResource() {
        return keycloakAdminClient.realm(keycloakProperties.getRealm()).roles();
    }

    /* ---------------- GET Calls ---------------- */

    /**
     * Fetch user details by email.
     */
    @Retry(name = "keycloak")
    @CircuitBreaker(name = "keycloak", fallbackMethod = "getUserDetailsFallback")
    @Bulkhead(name = "keycloak", type = Bulkhead.Type.SEMAPHORE)
    public KeycloakUserData getUserDetails(String email) {
        List<UserRepresentation> users = usersResource()
                .search(email, 0, 2); // search by username (same as email)

        if (users.isEmpty()) {
            log.warn("No user found with email: {}", email);
            return null;
        } else if (users.size() > 1) {
            String errorMsg = "Multiple users found with the same email (username): " + email;
            log.error(errorMsg);
            throw new IllegalStateException(errorMsg);
        }

        UserRepresentation user = users.getFirst();
        return new KeycloakUserData(user.getId(), user.getUsername(), user.getEmail());
    }

    private KeycloakUserData getUserDetailsFallback(String email, Throwable t) {
        log.error("Error fetching user details for email {}", email, t);
        return null;
    }


    /**
     * Fetch all realm roles.
     */
    @Retry(name = "keycloak")
    @CircuitBreaker(name = "keycloak", fallbackMethod = "getAllUserRolesFallback")
    @Bulkhead(name = "keycloak", type = Bulkhead.Type.SEMAPHORE)
    public List<UserRoleData> getAllUserRoles() {
        List<RoleRepresentation> roles = rolesResource().list();
        // Map RoleRepresentation to UserRoleData DTO
        return roles.stream()
                .map(role -> new UserRoleData(role.getId(), role.getName()))
                .collect(Collectors.toList());
    }

    private List<UserRoleData> getAllUserRolesFallback(Throwable t) {
        log.error("Error fetching user roles", t);
        return Collections.emptyList();
    }

    /* ---------------- POST Calls ---------------- */

    /**
     * Registers a new user in Keycloak.
     */
    @CircuitBreaker(name = "keycloak", fallbackMethod = "registerNewUserFallback")
    public void registerNewUser(UserRegistrationRequest request) {
        UserRepresentation user = new UserRepresentation();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setEnabled(true);
        user.setEmailVerified(request.emailVerified());

        List<CredentialRepresentation> credentials = request.credentials().stream().map(credential -> {
            var representation = new CredentialRepresentation();
            representation.setType(credential.type());
            representation.setValue(credential.value());
            representation.setTemporary(false);
            return representation;
        }).toList();

        user.setCredentials(credentials);

        try (Response response = usersResource().create(user)) {
            if (response.getStatus() != 201 && response.getStatus() != 204 && response.getStatus() != 200) {
                throw new RuntimeException("Failed to create user, status: " + response.getStatus());
            }
        }
    }

    private void registerNewUserFallback(UserRegistrationRequest request, Throwable t) {
        log.error("Error registering new user: {}", request.email(), t);
    }

    /**
     * Maps a single role to a user.
     */
    @CircuitBreaker(name = "keycloak", fallbackMethod = "mapRoleFallback")
    public void mapRoleToKeycloakUser(UserRoleData roleData, UUID userId) {
        RoleResource roleResource = rolesResource().get(roleData.roleName());
        RoleRepresentation roleRep = roleResource.toRepresentation();

        usersResource().get(userId.toString())
                .roles()
                .realmLevel()
                .add(Collections.singletonList(roleRep));
    }

    private void mapRoleFallback(UserRoleData roleData, UUID userId, Throwable t) {
        log.error("Error mapping role {} to user {}", roleData.roleName(), userId, t);
    }

    /**
     * Maps multiple roles to a user.
     */
    @CircuitBreaker(name = "keycloak", fallbackMethod = "mapRolesFallback")
    public void mapRolesToKeycloakUser(List<UserRoleData> roles, UUID userId) {
        List<RoleRepresentation> roleReps = roles.stream()
                .map(role -> rolesResource().get(role.roleName()).toRepresentation())
                .collect(Collectors.toList());

        usersResource().get(userId.toString())
                .roles()
                .realmLevel()
                .add(roleReps);
    }

    private void mapRolesFallback(List<UserRoleData> roles, UUID userId, Throwable t) {
        log.error("Error mapping roles to user {}", userId, t);
    }

    @SuppressWarnings("deprecation")
    @Retry(name = "keycloak")
    @CircuitBreaker(name = "keycloak", fallbackMethod = "hasAtLeastOneRealUserWithRoleFallback")
    @Bulkhead(name = "keycloak", type = Bulkhead.Type.SEMAPHORE)
    public boolean hasAtLeastOneRealUserWithRole(UserRole role) {
        Set<UserRepresentation> usersWithRole =rolesResource()
                .get(role.getDisplayName())
                .getRoleUserMembers(0, 10);

        if (usersWithRole == null || usersWithRole.isEmpty()) {
            return false;
        }

        return usersWithRole.stream()
                .anyMatch(user -> !user.getUsername().startsWith("service-account"));
    }

    private boolean hasAtLeastOneRealUserWithRoleFallback(UserRole role, Throwable t) {
        log.error("Failed to check users with role {} due to {}", role.getDisplayName(), t.toString());
        return false;
    }


    /* ---------------------- Helpers ----------------------- */

    /**
     * Validates user data before returning.
     */
    private KeycloakUserData validateUserDataBeforeReturn(String email, List<UserRepresentation> users) {
        if (users == null || users.isEmpty()) {
            return null;
        }
        if (users.size() > 1) {
            log.warn("Multiple users found with email: {}. Using the first one.", email);
        }
        UserRepresentation user = users.getFirst();
        // Convert to your KeycloakUserData model as needed
        return new KeycloakUserData(user.getId(), user.getUsername(), user.getEmail());
    }
}
