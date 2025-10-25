package com.donkie.quickcart.user.infra.integration.keycloak;

import com.donkie.quickcart.shared.integration.helper.HttpCallFallbackHandler;
import com.donkie.quickcart.user.application.model.LoginCommand;
import com.donkie.quickcart.user.application.model.LoginResult;
import com.donkie.quickcart.user.infra.exception.ExternalServiceException;
import com.donkie.quickcart.user.infra.integration.keycloak.tokens.AdminTokenService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.util.Objects;

import static com.donkie.quickcart.user.infra.integration.helper.InfraExceptionBuilder.buildExternalServiceException;

/**
 * Client for handling authentication operations against Keycloak using RestClient.
 */
@Component
@Slf4j
public class KeycloakAuthClient {

    private final AdminTokenService adminTokenService;
    private final KeycloakProperties keycloakProperties;
    private final RestClient restClient;

    public KeycloakAuthClient(AdminTokenService adminTokenService, KeycloakProperties keycloakProperties) {
        this.adminTokenService = adminTokenService;
        this.keycloakProperties = keycloakProperties;
        this.restClient = RestClient.builder()
                .baseUrl(keycloakProperties.getUrl())
                .build();
    }

    /**
     * Calls Keycloak token endpoint using password grant and maps the token response
     * to {@link LoginResult.Detail}.
     *
     * @param command login command containing email and password
     * @return mapped {@link LoginResult.Detail}
     */
    @CircuitBreaker(name = "keycloak", fallbackMethod = "loginUserFallback")
    public LoginResult.Detail loginUser(LoginCommand.Create command) throws ExternalServiceException {
        log.debug("Logging in user {}", command.email());

        String path = "/realms/{realm}/protocol/openid-connect/token";

        // Build form data for x-www-form-urlencoded
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "password");
        formData.add("client_id", keycloakProperties.getAdminClientId());
        formData.add("client_secret", keycloakProperties.getAdminClientSecret());
        formData.add("username", command.email());
        formData.add("password", command.password());

        TokenResponse token = restClient.post()
                .uri(path, keycloakProperties.getRealm())
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminTokenService.getAccessToken())
                .body(formData)
                .retrieve()
                .body(TokenResponse.class);

        if (token == null) {
            log.error("Keycloak returned null token for user {}", command.email());
            throw new ExternalServiceException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to obtain tokens from Identity Service.");
        }

        return safeMapToLoginResultDetail(token);
    }

    /**
     * Refreshes the access token using a valid refresh token.
     * Keycloak will return a new access token and a rotated refresh token.
     *
     * @param refreshToken the refresh token to exchange for new tokens
     * @return mapped {@link LoginResult.Detail} containing new tokens
     * @throws ExternalServiceException if refresh fails (e.g., refresh token expired/invalid)
     */
    @CircuitBreaker(name = "keycloak", fallbackMethod = "refreshTokenFallback")
    public LoginResult.Detail refreshToken(String refreshToken) throws ExternalServiceException {
        log.debug("Refreshing access token using refresh token");

        String path = "/realms/{realm}/protocol/openid-connect/token";

        // Build form data for refresh_token grant
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "refresh_token");
        formData.add("client_id", keycloakProperties.getAdminClientId());
        formData.add("client_secret", keycloakProperties.getAdminClientSecret());
        formData.add("refresh_token", refreshToken);

        TokenResponse token = restClient.post()
                .uri(path, keycloakProperties.getRealm())
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(formData)
                .retrieve()
                .onStatus(status -> status.value() == 400, (request, response) -> {
                    log.error("Refresh token is invalid or expired");
                    throw new ExternalServiceException(
                            HttpStatus.UNAUTHORIZED,
                            "Refresh token is invalid or expired. Please login again.");
                })
                .body(TokenResponse.class);

        if (token == null) {
            log.error("Keycloak returned null token during refresh");
            throw new ExternalServiceException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to refresh tokens from Identity Service.");
        }

        log.debug("Successfully refreshed access token");
        return safeMapToLoginResultDetail(token);
    }

    private static LoginResult.Detail safeMapToLoginResultDetail(TokenResponse token) {
        Objects.requireNonNull(token, "token must not be null");

        return new LoginResult.Detail(
                Objects.requireNonNullElse(token.access_token, ""),
                token.expires_in != null ? token.expires_in : 0,
                Objects.requireNonNullElse(token.refresh_token, ""),
                token.refresh_expires_in != null ? token.refresh_expires_in : 0,
                Objects.requireNonNullElse(token.token_type, "")
        );
    }

    @SuppressWarnings("unused") // Resilience4j fallback method
    private LoginResult.Detail loginUserFallback(LoginCommand.Create command, Throwable t) {
        return HttpCallFallbackHandler.throwException(() -> buildExternalServiceException(t, "Login"));
    }

    @SuppressWarnings("unused") // Resilience4j fallback method
    private LoginResult.Detail refreshTokenFallback(String refreshToken, Throwable t) {
        return HttpCallFallbackHandler.throwException(() -> buildExternalServiceException(t, "Token Refresh"));
    }

    /**
     * Minimal internal DTO for Keycloak token response.
     * Only contains fields we care about for mapping.
     */
    private record TokenResponse(
            String access_token,
            Integer expires_in,
            Integer refresh_expires_in,
            String refresh_token,
            String token_type
    ) {
    }
}
