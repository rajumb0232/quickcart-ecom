package com.donkie.quickcart.user.infra.integration.client;

import com.donkie.quickcart.user.infra.integration.client.tokens.AdminTokens;
import com.donkie.quickcart.user.infra.integration.config.KeycloakProperties;
import com.donkie.quickcart.user.infra.integration.model.AdminTokenResult;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
@Slf4j
public class AdminTokenService {

    private final WebClient webClient;
    private final KeycloakProperties props;
    private final AdminTokens adminTokens;

    public AdminTokenService(KeycloakProperties props, AdminTokens adminTokens) {
        this.props = props;
        this.adminTokens = adminTokens;
        this.webClient = WebClient.builder().baseUrl(props.getUrl()).build();
    }

    @PostConstruct
    public void initOnStartup() {
        log.info("Fetching initial Keycloak admin token for realm='{}' client='{}'", props.getRealm(), props.getAdminClientId());
        try {
            AdminTokenResult token = fetchToken();
            adminTokens.setTokens(token);
        } catch (Exception e) {
            log.error("Failed to fetch initial Keycloak token for realm='{}' client='{}' — continuing startup", props.getRealm(), props.getAdminClientId(), e);
        }
    }

    private AdminTokenResult fetchToken() {
        // use placeholder in path to avoid accidental double-replace / slash issues
        String tokenPathTemplate = "/realms/{realm}/protocol/openid-connect/token";
        String resolvedUrlForLog = props.getUrl() == null ? tokenPathTemplate : props.getUrl().replaceAll("/$", "") + tokenPathTemplate.replace("{realm}", props.getRealm());
        log.debug("Requesting token from '{}'", resolvedUrlForLog);

        Mono<AdminTokenResult> mono = webClient.post()
                .uri(uriBuilder -> uriBuilder.path(tokenPathTemplate).build(props.getRealm()))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .body(BodyInserters.fromFormData("grant_type", "client_credentials")
                        .with("client_id", props.getAdminClientId())
                        .with("client_secret", props.getAdminClientSecret()))
                .retrieve()
                .bodyToMono(AdminTokenResult.class);

        AdminTokenResult result = mono.block();
        if (result != null) {
            log.debug("Received token: expires_in={}", result.expiresIn());
        }
        return result;
    }
}
