package com.donkie.quickcart.user.infra.integration.keycloak;

import com.donkie.quickcart.user.infra.integration.keycloak.tokens.AdminTokenService;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

/**
 * Lightweight helper that centralizes WebClient request construction for KeycloakRequestHandler calls.
 * Provides a fluent Action to apply default headers (auth, content-type) and execute requests.
 */
@Component
@Slf4j
public class KeycloakRequestHandler {

    private final AdminTokenService adminTokenService;
    private final KeycloakProperties keycloakProperties;
    private final WebClient webClient;

    /**
     * Constructs a KeycloakClient with required dependencies.
     *
     * @param adminTokenService  service for obtaining admin access tokens
     * @param keycloakProperties KeycloakRequestHandler configuration properties
     */
    public KeycloakRequestHandler(AdminTokenService adminTokenService, KeycloakProperties keycloakProperties) {
        this.adminTokenService = adminTokenService;
        this.keycloakProperties = keycloakProperties;
        this.webClient = WebClient.builder()
                .baseUrl(keycloakProperties.getUrl())
                .build();
    }

    public ActionDescription newRequest() {
        return new ActionDescription();
    }

    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    public class SafeActionExecutor {
        private final String actionDescription;

        public <T> T execute(KeycloakAction<T> action) {
            try {
                return action.act(adminTokenService, keycloakProperties, webClient);
            } catch (WebClientResponseException wex) {
                log.error("KeycloakRequestHandler API error during {}: status={} body={}", actionDescription, wex.getStatusCode(), wex.getResponseBodyAsString());
                throw new RuntimeException("KeycloakRequestHandler API error during " + actionDescription, wex);
            } catch (Exception ex) {
                log.error("Error during {}: {}", actionDescription, ex.getMessage(), ex);
                throw new RuntimeException("Error during " + actionDescription, ex);
            }
        }
    }

    public interface KeycloakAction<T> {
        T act(AdminTokenService adminTokenService, KeycloakProperties keycloakProperties, WebClient webClient);
    }

    public class ActionDescription {
        public SafeActionExecutor actionDescription(String actionDescription) {
            return new SafeActionExecutor(actionDescription);
        }
    }
}
