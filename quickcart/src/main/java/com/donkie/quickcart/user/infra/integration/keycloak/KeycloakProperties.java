package com.donkie.quickcart.user.infra.integration.keycloak;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "keycloak")
@Getter
@Setter
public class KeycloakProperties {
    private String url;
    private String realm;
    private String adminClientId;
    private String adminClientSecret;
}
