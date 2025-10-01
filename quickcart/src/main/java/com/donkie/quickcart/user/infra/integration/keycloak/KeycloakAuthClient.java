package com.donkie.quickcart.user.infra.integration.keycloak;

import com.donkie.quickcart.user.application.model.LoginCommand;
import com.donkie.quickcart.user.application.model.LoginResult;
import com.donkie.quickcart.user.infra.integration.keycloak.tokens.AdminTokenService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.util.Map;
import java.util.Objects;

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
    public LoginResult.Detail loginUser(LoginCommand.Create command) {
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
            throw new RuntimeException("Empty token response from Keycloak");
        }

        int accessExpires = token.expires_in != null ? token.expires_in : 0;
        int refreshExpires = token.refresh_expires_in != null ? token.refresh_expires_in : 0;

        return new LoginResult.Detail(
                Objects.requireNonNullElse(token.access_token, ""),
                accessExpires,
                Objects.requireNonNullElse(token.refresh_token, ""),
                refreshExpires,
                Objects.requireNonNullElse(token.token_type, "")
        );
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
    ) {}
}
