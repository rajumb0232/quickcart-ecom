package com.donkie.quickcart.user.infra.integration.keycloak;

import com.donkie.quickcart.user.infra.integration.keycloak.tokens.AdminTokenService;
import com.donkie.quickcart.user.infra.integration.keycloak.model.KeycloakUserData;
import com.donkie.quickcart.user.infra.integration.keycloak.model.UserRegistrationRequest;
import com.donkie.quickcart.user.infra.integration.keycloak.model.UserRoleData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.UUID;

/**
 * Client for interacting with Keycloak Admin API using RestClient.
 * Provides user management and role assignment operations.
 */
@Component
@Slf4j
public class KeycloakClient {

    private final AdminTokenService adminTokenService;
    private final KeycloakProperties keycloakProperties;
    private final RestClient restClient;

    public KeycloakClient(AdminTokenService adminTokenService, KeycloakProperties keycloakProperties) {
        this.adminTokenService = adminTokenService;
        this.keycloakProperties = keycloakProperties;
        this.restClient = RestClient.builder()
                .baseUrl(keycloakProperties.getUrl())
                .build();
    }

    /**
     * Retrieves user details by email/username.
     *
     * @param email the email/username to search for
     * @return user data or null if not found
     */
    public KeycloakUserData getUserDetails(String email) {
        log.debug("Fetching user details from Keycloak for email: {}", email);

        String path = "/admin/realms/{realm}/users";

        List<KeycloakUserData> users = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path(path)
                        .queryParam("username", email)
                        .build(keycloakProperties.getRealm()))
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminTokenService.getAccessToken())
                .retrieve()
                .body(new ParameterizedTypeReference<>() {
                });

        return validateUserDataBeforeReturn(email, users);
    }

    /**
     * Retrieves all available user roles from the realm.
     *
     * @return list of user roles
     */
    public List<UserRoleData> getAllUserRoles() {
        String path = "/admin/realms/{realm}/roles";

        List<UserRoleData> roles = restClient.get()
                .uri(path, keycloakProperties.getRealm())
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminTokenService.getAccessToken())
                .retrieve()
                .body(new ParameterizedTypeReference<>() {
                });

        log.info("Successfully retrieved {} user roles from Keycloak", roles != null ? roles.size() : 0);
        return roles;
    }

    /**
     * Registers a new user in Keycloak.
     *
     * @param registrationRequest the user registration details
     */
    public void registerNewUser(UserRegistrationRequest registrationRequest) {
        log.debug("Registering new user with email: {}", registrationRequest.email());

        String path = "/admin/realms/{realm}/users";

        restClient.post()
                .uri(path, keycloakProperties.getRealm())
                .contentType(MediaType.APPLICATION_JSON)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminTokenService.getAccessToken())
                .body(registrationRequest)
                .retrieve()
                .toBodilessEntity();

        log.info("Successfully registered new user with email: {}", registrationRequest.email());
    }

    /**
     * Assigns a role to a Keycloak user.
     *
     * @param roleData the role to assign
     * @param userId   the user ID to assign the role to
     */
    public void mapRoleToKeyCloakUser(UserRoleData roleData, UUID userId) {
        log.debug("Mapping role to Keycloak user with role ID: {}", roleData.roleId());

        String path = "/admin/realms/{realm}/users/{userId}/role-mappings/realm";

        restClient.post()
                .uri(path, keycloakProperties.getRealm(), userId.toString())
                .contentType(MediaType.APPLICATION_JSON)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminTokenService.getAccessToken())
                .body(List.of(roleData))
                .retrieve()
                .toBodilessEntity();

        log.info("Successfully mapped role {} to user {}", roleData.roleName(), userId);
    }

    /* ------------------------- Helper methods --------------------------- */

    private KeycloakUserData validateUserDataBeforeReturn(String email, List<KeycloakUserData> users) {
        if (users == null || users.isEmpty()) {
            log.warn("No user found with email: {}", email);
            return null;
        }

        if (users.size() > 1) {
            log.warn("Multiple users found with email: {}. Using the first one.", email);
        }

        log.info("Successfully retrieved user details for email: {}", email);
        return users.getFirst(); // fine on Java 21+, use get(0) on 17
    }
}
