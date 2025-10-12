package com.donkie.quickcart.shared.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app")
@Setter
@Getter
public class ApplicationProperties {
    private Admin admin;

    @Setter
    @Getter
    public static class Admin {
        private String username;
        private String password;
    }
}
