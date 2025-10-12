package com.donkie.quickcart.shared.config;

import org.springframework.boot.web.client.RestClientCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.JdkClientHttpRequestFactory;

import java.time.Duration;

/**
 * Configuration class for setting up the RestClient for the timeouts.
 */
@Configuration
public class RestClientConfig {

    @Bean
    RestClientCustomizer restClientTimeouts() {
        return builder -> {
            var jdk = java.net.http.HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(1))
                    .build();
            var factory = new JdkClientHttpRequestFactory(jdk);
            factory.setReadTimeout(Duration.ofSeconds(2));
            builder.requestFactory(factory);
        };
    }
}
