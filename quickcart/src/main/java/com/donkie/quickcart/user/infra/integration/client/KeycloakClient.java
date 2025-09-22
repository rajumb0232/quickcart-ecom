package com.donkie.quickcart.user.infra.integration.client;

import com.donkie.quickcart.user.infra.integration.config.KeycloakProperties;
import com.donkie.quickcart.user.infra.integration.model.KeycloakUserData;
import com.donkie.quickcart.user.infra.integration.model.UserRegistrationRequest;
import com.donkie.quickcart.user.infra.integration.model.UserRoleData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;
import java.util.UUID;
import java.util.function.Supplier;

/**
 * Client for interacting with Keycloak Admin API.
 * Provides user management and role assignment operations.
 */
@Component
@Slf4j
public class KeycloakClient {

    private final AdminTokenService adminTokenService;
    private final KeycloakProperties keycloakProperties;
    private final WebClient webClient;

    /**
     * Constructs a KeycloakClient with required dependencies.
     *
     * @param adminTokenService  service for obtaining admin access tokens
     * @param keycloakProperties Keycloak configuration properties
     */
    public KeycloakClient(AdminTokenService adminTokenService, KeycloakProperties keycloakProperties) {
        this.adminTokenService = adminTokenService;
        this.keycloakProperties = keycloakProperties;
        this.webClient = WebClient.builder()
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

        var requestSpec = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path(path)
                        .queryParam("username", email)
                        .build(keycloakProperties.getRealm()));

        List<KeycloakUserData> users = executeWithHandling(
                () -> setAuthorizationHeader(requestSpec)
                        .retrieve()
                        .bodyToMono(new ParameterizedTypeReference<>() {
                        }),
                Duration.ofSeconds(30),
                "fetch user details for " + email
        );

        return validateUserDataBeforeReturn(email, users);
    }

    /**
     * Retrieves all available user roles from the realm.
     *
     * @return list of user roles
     */
    public List<UserRoleData> getAllUserRoles() {
        log.debug("Fetching all user roles from Keycloak realm: {}", keycloakProperties.getRealm());

        String path = "/admin/realms/{realm}/roles";

        var requestSpec = webClient.get()
                .uri(uriBuilder -> uriBuilder.path(path).build(keycloakProperties.getRealm()));

        List<UserRoleData> roles = executeWithHandling(
                () -> setAuthorizationHeader(requestSpec)
                        .retrieve()
                        .bodyToMono(new ParameterizedTypeReference<>() {
                        }),
                Duration.ofSeconds(30),
                "fetch roles"
        );

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

        var requestSpec = webClient.post()
                .uri(uriBuilder -> uriBuilder.path(path).build(keycloakProperties.getRealm()))
                .header("Content-Type", "application/json")
                .bodyValue(registrationRequest);

        // use Mono<Void> via toBodilessEntity().then()
        executeWithHandling(
                () -> setAuthorizationHeader(requestSpec)
                        .retrieve()
                        .toBodilessEntity()
                        .then(Mono.empty()),
                Duration.ofSeconds(30),
                "register user " + registrationRequest.email()
        );

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

        var requestSpec = webClient.post()
                .uri(uriBuilder -> uriBuilder.path(path).build(keycloakProperties.getRealm(), userId.toString()))
                .header("Content-Type", "application/json")
                .bodyValue(List.of(roleData)); // API expects an array of role objects

        executeWithHandling(
                () -> setAuthorizationHeader(requestSpec)
                        .retrieve()
                        .toBodilessEntity()
                        .then(Mono.empty()),
                Duration.ofSeconds(30),
                "map role " + roleData.roleId() + " to user " + userId
        );

        log.info("Successfully mapped role {} to user {}", roleData.roleName(), userId);
    }

    /* ------------------------- Helper methods --------------------------- */

    /**
     * Sets the authorization header for the given request spec.
     *
     * @param requestSpec the request spec to set the authorization header for
     * @return the request spec with the authorization header set
     */
    private WebClient.RequestHeadersSpec<?> setAuthorizationHeader(
            WebClient.RequestHeadersSpec<?> requestSpec) {
        String accessToken = adminTokenService.getAccessToken();
        return requestSpec.header("Authorization", "Bearer " + accessToken);
    }

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

    /**
     * Centralized execution wrapper for WebClient Mono calls.
     * - supplier returns a Mono<T>
     * - blocks with provided timeout
     * - catches WebClientResponseException and generic exceptions, logs nicely and rethrows RuntimeException
     */
    private <T> T executeWithHandling(Supplier<Mono<T>> supplier, Duration timeout, String actionDescription) {
        try {
            return supplier.get().block(timeout);
        } catch (WebClientResponseException wex) {
            log.error("Keycloak API error during {}: status={} body={}", actionDescription, wex.getStatusCode(), wex.getResponseBodyAsString());
            throw new RuntimeException("Keycloak API error during " + actionDescription, wex);
        } catch (Exception ex) {
            log.error("Error during {}: {}", actionDescription, ex.getMessage(), ex);
            throw new RuntimeException("Error during " + actionDescription, ex);
        }
    }
}
