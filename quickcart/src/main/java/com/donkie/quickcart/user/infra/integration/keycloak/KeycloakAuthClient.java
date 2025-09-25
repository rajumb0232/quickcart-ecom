package com.donkie.quickcart.user.infra.integration.keycloak;

import com.donkie.quickcart.user.application.model.LoginCommand;
import com.donkie.quickcart.user.application.model.LoginResult;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;

import java.time.Duration;
import java.util.Objects;

/**
 * Client for handling authentication operations against KeycloakRequestHandler.
 */
@AllArgsConstructor
@Component
@Slf4j
public class KeycloakAuthClient {

    private final KeycloakRequestHandler requestHandler;

    /**
     * Calls KeycloakRequestHandler token endpoint using password grant and maps the token response
     * to {@link LoginResult.Detail}.
     *
     * @param command login command containing email and password
     * @return mapped {@link LoginResult.Detail}
     */
    public LoginResult.Detail loginUser(LoginCommand.Create command) {
        log.debug("Logging in user {}", command.email());

        String path = "/realms/{realm}/protocol/openid-connect/token";

        TokenResponse token =requestHandler.newRequest()
                .actionDescription("Logging in user: " + command.email())
                .execute(
                        (adminTokenService, keycloakProperties, webClient) -> webClient
                                .post()
                                .uri(uriBuilder -> uriBuilder.path(path)
                                        .build(keycloakProperties.getRealm()))
                                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminTokenService.getAccessToken())
                                .body(BodyInserters.fromFormData("grant_type", "password")
                                        .with("client_id", keycloakProperties.getAdminClientId())
                                        .with("client_secret", keycloakProperties.getAdminClientSecret())
                                        .with("username", command.email())
                                        .with("password", command.password()))
                                .retrieve()
                                .bodyToMono(TokenResponse.class)
                                .block(Duration.ofSeconds(10)));

            if (token == null) {
                log.error("KeycloakRequestHandler returned null token for user {}", command.email());
                throw new RuntimeException("Empty token response from KeycloakRequestHandler");
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
     * Minimal internal DTO for KeycloakRequestHandler token response.
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
