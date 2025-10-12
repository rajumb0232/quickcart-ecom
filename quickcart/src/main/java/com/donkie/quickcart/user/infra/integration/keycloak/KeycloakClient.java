package com.donkie.quickcart.user.infra.integration.keycloak;

import com.donkie.quickcart.shared.integration.helper.HttpCallFallbackHandler;
import com.donkie.quickcart.user.infra.integration.keycloak.model.KeycloakUserData;
import com.donkie.quickcart.user.infra.integration.keycloak.model.UserRegistrationRequest;
import com.donkie.quickcart.user.infra.integration.keycloak.model.UserRoleData;
import com.donkie.quickcart.user.infra.integration.keycloak.tokens.AdminTokenService;
import io.github.resilience4j.bulkhead.annotation.Bulkhead;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.UUID;

import static com.donkie.quickcart.shared.integration.helper.ClientResponseStatusResolver.resolveBaseExceptionStatus;
import static com.donkie.quickcart.shared.integration.helper.ClientResponseStatusResolver.resolveStatus;
import static com.donkie.quickcart.user.infra.integration.helper.InfraExceptionBuilder.buildExternalServiceException;
import static com.donkie.quickcart.user.infra.integration.helper.KeycloakResultStatusToMessageResolver.resolveMessageForClientResponseStatus;

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

    /**
     * Constructs a new KeycloakClient with the specified configuration.
     *
     * @param adminTokenService  Required for admin credentials while making HTTP Calls
     * @param keycloakProperties Required for Keycloak Admin API URL and realm details
     */
    public KeycloakClient(AdminTokenService adminTokenService, KeycloakProperties keycloakProperties) {
        this.adminTokenService = adminTokenService;
        this.keycloakProperties = keycloakProperties;
        this.restClient = RestClient.builder()
                .baseUrl(keycloakProperties.getUrl())
                .build();
    }

    /* ---------------- GET Calls (Retry + CB + Bulkhead) ---------------- */

    /**
     * Retrieves user details by email. Uses Circuit Breaker for resilience.
     *
     * @param email The email of the user to retrieve details for.
     * @return User details if found, otherwise null.
     */
    @Retry(name = "keycloak")
    @CircuitBreaker(name = "keycloak", fallbackMethod = "getUserDetailsFallback")
    @Bulkhead(name = "keycloak", type = Bulkhead.Type.SEMAPHORE)
    public KeycloakUserData getUserDetails(String email) {
        String path = "/admin/realms/{realm}/users";
        List<KeycloakUserData> users = restClient.get()
                .uri(uriBuilder -> uriBuilder.path(path).queryParam("username", email).build(keycloakProperties.getRealm()))
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminTokenService.getAccessToken())
                .retrieve()
                .body(new ParameterizedTypeReference<>() {
                });
        return validateUserDataBeforeReturn(email, users);
    }

    /**
     * Fallback method for getUserDetails when an exception occurs. Logs the error and returns null.
     *
     * @param email The email of the user to retrieve details for.
     * @param t     The exception that occurred during the request.
     * @return null.
     */
    @SuppressWarnings("unused")
    private KeycloakUserData getUserDetailsFallback(String email, Throwable t) {
        return HttpCallFallbackHandler.throwException(() -> buildExternalServiceException(t, "Fetch User Details"));
    }

    /**
     * Retrieves all user roles (catalogue). Uses Circuit Breaker for resilience.
     *
     * @return List of UserRoleData if found, otherwise null.
     */
    @Retry(name = "keycloak")
    @CircuitBreaker(name = "keycloak", fallbackMethod = "getAllUserRolesFallback")
    @Bulkhead(name = "keycloak", type = Bulkhead.Type.SEMAPHORE)
    public List<UserRoleData> getAllUserRoles() {
        String path = "/admin/realms/{realm}/roles";
        return restClient.get()
                .uri(path, keycloakProperties.getRealm())
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminTokenService.getAccessToken())
                .retrieve()
                .body(new ParameterizedTypeReference<>() {
                });
    }

    /**
     * Fallback method for getAllUserRoles when an exception occurs. Logs the error and returns an empty list.
     *
     * @param t The exception that occurred during the request.
     * @return null.
     */
    private List<UserRoleData> getAllUserRolesFallback(Throwable t) {
        return HttpCallFallbackHandler.throwException(() -> buildExternalServiceException(t, "Fetch User Roles"));
    }

    /*
     * ---------------- POST Calls (CircuitBreaker only) ----------------
     */

    /**
     * Registers a new user in Keycloak. Uses Circuit Breaker for resilience.
     *
     * @param request The user registration request.
     */
    @CircuitBreaker(name = "keycloak", fallbackMethod = "registerNewUserFallback")
    public void registerNewUser(UserRegistrationRequest request) {
        String path = "/admin/realms/{realm}/users";
        restClient.post()
                .uri(path, keycloakProperties.getRealm())
                .contentType(MediaType.APPLICATION_JSON)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminTokenService.getAccessToken())
                .body(request)
                .retrieve()
                .toBodilessEntity();
    }

    /**
     * Fallback method for registerNewUser when an exception occurs. Logs the error and does nothing.
     *
     * @param request The user registration request.
     * @param t The exception that occurred during the request.
     * @return null.
     */
    private Void registerNewUserFallback(UserRegistrationRequest request, Throwable t) {
        return HttpCallFallbackHandler.throwException(() -> buildExternalServiceException(t, "Register user"));
    }

    /**
     * Maps a role to a user in Keycloak. Uses Circuit Breaker for resilience.
     *
     * @param roleData The role data to map to the user.
     * @param userId The user ID to map the role to.
     */
    @CircuitBreaker(name = "keycloak", fallbackMethod = "mapRoleFallback")
    public void mapRoleToKeyCloakUser(UserRoleData roleData, UUID userId) {
        String path = "/admin/realms/{realm}/users/{userId}/role-mappings/realm";
        restClient.post()
                .uri(path, keycloakProperties.getRealm(), userId.toString())
                .contentType(MediaType.APPLICATION_JSON)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminTokenService.getAccessToken())
                .body(List.of(roleData))
                .retrieve()
                .toBodilessEntity();
    }

    /**
     * Fallback method for mapRoleToKeyCloakUser when an exception occurs. Logs the error and does nothing.
     *
     * @param roleData The role data to map to the user.
     * @param userId The user ID to map the role to.
     * @param t The exception that occurred during the request.
     * @return null.
     */
    @SuppressWarnings("unused")
    private Void mapRoleFallback(UserRoleData roleData, UUID userId, Throwable t) {
        return HttpCallFallbackHandler.throwException(() -> buildExternalServiceException(t, "Role mapping"));
    }

    /* ---------------------- Helpers ----------------------- */

    /**
     * Validates the user data before returning it. Logs warnings if no user is found or multiple users are found.
     *
     * @param email The email of the user to validate.
     * @param users The list of user data retrieved from Keycloak.
     * @return The validated user data or null if no user is found or multiple users are found.
     */
    private KeycloakUserData validateUserDataBeforeReturn(String email, List<KeycloakUserData> users) {
        if (users == null || users.isEmpty()) {
            log.warn("No user found with email: {}", email);
            return null;
        }
        if (users.size() > 1) {
            log.warn("Multiple users found with email: {}. Using the first one.", email);
        }
        return users.getFirst();
    }
}
