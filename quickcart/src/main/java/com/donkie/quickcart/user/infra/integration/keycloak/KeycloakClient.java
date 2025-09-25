package com.donkie.quickcart.user.infra.integration.keycloak;

import com.donkie.quickcart.user.infra.integration.model.KeycloakUserData;
import com.donkie.quickcart.user.infra.integration.model.UserRegistrationRequest;
import com.donkie.quickcart.user.infra.integration.model.UserRoleData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;
import java.util.UUID;
import java.util.function.Supplier;

/**
 * Client for interacting with KeycloakRequestHandler Admin API.
 * Provides user management and role assignment operations.
 */
@Component
@Slf4j
public class KeycloakClient {

    private final KeycloakRequestHandler requestHandler;

    /**
     * Constructs a KeycloakClient with required dependencies.
     *
     * @param requestHandler the KeycloakRequestHandler configuration properties
     */
    public KeycloakClient(KeycloakRequestHandler requestHandler) {
        this.requestHandler = requestHandler;
    }

    /**
     * Retrieves user details by email/username.
     *
     * @param email the email/username to search for
     * @return user data or null if not found
     */
    public KeycloakUserData getUserDetails(String email) {
        log.debug("Fetching user details from KeycloakRequestHandler for email: {}", email);
        String path = "/admin/realms/{realm}/users";

        List<KeycloakUserData> users = requestHandler.newRequest()
                .actionDescription("Fetching user details for email: " + email)
                .execute(
                        (adminTokenService, keycloakProperties, webClient) -> webClient
                        .get()
                        .uri(uriBuilder -> uriBuilder
                                .path(path)
                                .queryParam("username", email)
                                .build(keycloakProperties.getRealm()))
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminTokenService.getAccessToken())
                        .retrieve()
                        .bodyToMono(new ParameterizedTypeReference<List<KeycloakUserData>>() {
                        })
                        .block(Duration.ofSeconds(30))
                );

        return validateUserDataBeforeReturn(email, users);
    }

    /**
     * Retrieves all available user roles from the realm.
     *
     * @return list of user roles
     */
    public List<UserRoleData> getAllUserRoles() {
        String path = "/admin/realms/{realm}/roles";

        List<UserRoleData> roles = requestHandler.newRequest()
                .actionDescription("Fetching all user roles from realm")
                .execute((adminTokenService, keycloakProperties, webClient) -> webClient
                        .get()
                        .uri(uriBuilder -> uriBuilder.path(path)
                                .build(keycloakProperties.getRealm()))
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminTokenService.getAccessToken())
                        .retrieve()
                        .bodyToMono(new ParameterizedTypeReference<List<UserRoleData>>() {
                        }).block(Duration.ofSeconds(10)));

        log.info("Successfully retrieved {} user roles from KeycloakRequestHandler", roles != null ? roles.size() : 0);
        return roles;
    }

    /**
     * Registers a new user in KeycloakRequestHandler.
     *
     * @param registrationRequest the user registration details
     */
    public void registerNewUser(UserRegistrationRequest registrationRequest) {
        log.debug("Registering new user with email: {}", registrationRequest.email());

        String path = "/admin/realms/{realm}/users";

        requestHandler.newRequest()
                .actionDescription("Registering new user with email: " + registrationRequest.email())
                .execute(
                (adminTokenService, keycloakProperties, webClient) -> webClient
                        .post()
                        .uri(uriBuilder -> uriBuilder.path(path)
                                .build(keycloakProperties.getRealm()))
                        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminTokenService.getAccessToken())
                        .bodyValue(registrationRequest)
                        .retrieve()
                        .toBodilessEntity()
                        .block(Duration.ofSeconds(10))
                );

        log.info("Successfully registered new user with email: {}", registrationRequest.email());
    }

    /**
     * Assigns a role to a KeycloakRequestHandler user.
     *
     * @param roleData the role to assign
     * @param userId   the user ID to assign the role to
     */
    public void mapRoleToKeyCloakUser(UserRoleData roleData, UUID userId) {
        log.debug("Mapping role to KeycloakRequestHandler user with role ID: {}", roleData.roleId());

        String path = "/admin/realms/{realm}/users/{userId}/role-mappings/realm";

        requestHandler.newRequest()
                .actionDescription("Mapping role to KeycloakRequestHandler user with role ID: " + roleData.roleId())
                .execute(
                (adminTokenService, keycloakProperties, webClient) -> webClient
                        .post()
                        .uri(uriBuilder -> uriBuilder.path(path)
                                .build(keycloakProperties.getRealm(),
                                        userId.toString()))
                        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminTokenService.getAccessToken())
                        .bodyValue(List.of(roleData))
                        .retrieve()
                        .toBodilessEntity()
                        .block(Duration.ofSeconds(10)));

        log.info("Successfully mapped role {} to user {}", roleData.roleName(), userId);
    }

    /* ------------------------- Helper methods --------------------------- */

    /**
     * Validates user data before returning it. Logs warnings if multiple users are found or no user is found.
     *
     * @param email the email to validate
     * @param users the list of user data to validate
     * @return the validated user data or null if validation fails
     */
    private KeycloakUserData validateUserDataBeforeReturn(String email, List<KeycloakUserData> users) {
        if (users == null || users.isEmpty()) {
            log.warn("No user found with email: {}", email);
            return null;
        }

        if (users.size() > 1) {
            log.warn("Multiple users found with email: {}. Using the first one.", email);
        }

        log.info("Successfully retrieved user details for email: {}", email);
        return users.getFirst();
    }
}
