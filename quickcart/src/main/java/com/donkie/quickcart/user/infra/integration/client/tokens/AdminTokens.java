package com.donkie.quickcart.user.infra.integration.client.tokens;

import com.donkie.quickcart.user.infra.integration.model.AdminTokenResult;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Objects;

@Getter
@Component
@Slf4j
public class AdminTokens {
    private String accessToken;
    private int expiresIn;
    private Instant calculatedExpiration;

    public AdminTokens() {
        // bean created without constructor injection
    }

    public void setTokens(AdminTokenResult token) {
        Objects.requireNonNull(token, "AdminTokenResult cannot be null");
        this.accessToken = Objects.requireNonNull(token.accessToken(), "access token in AdminTokenResult cannot be null");
        this.expiresIn = token.expiresIn();
        this.calculatedExpiration = Instant.now().plusSeconds(this.expiresIn);
        log.info("Tokens successfully updated, with access expiry in {}", expiresIn);
    }
}