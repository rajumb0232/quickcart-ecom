package com.donkie.quickcart.user.infra.service;

import com.donkie.quickcart.user.domain.model.RevokedToken;
import com.donkie.quickcart.user.domain.repository.RevokedTokenRepo;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Slf4j
@Service
@AllArgsConstructor
public class TokenRevocationService {

    private final RevokedTokenRepo revokedTokenRepo;

    /**
     * Blacklist a token by its JTI until expiration time.
     */
    @Transactional
    public void blacklistToken(String jti, Instant expiration) {
        if (jti == null || expiration == null) {
            log.warn("Cannot blacklist token with null jti or expiration");
            return;
        }

        // Only blacklist if token hasn't expired yet
        if (expiration.isAfter(Instant.now())) {
            RevokedToken token = new RevokedToken();
            token.setJti(jti);
            token.setExpiration(expiration);

            revokedTokenRepo.save(token);
            log.debug("Token {} blacklisted until {}", jti, expiration);
        } else {
            log.debug("Token {} already expired, not blacklisting", jti);
        }
    }

    /**
     * Check if a token is blacklisted.
     */
    public boolean isBlacklisted(String jti) {
        if (jti == null) {
            return false;
        }
        return revokedTokenRepo.existsById(jti);
    }

    /**
     * Clean up expired tokens (run periodically).
     */
    @Transactional
    public void cleanupExpiredTokens() {
        var expiredTokens = revokedTokenRepo.findByExpirationBefore(Instant.now());
        if (!expiredTokens.isEmpty()) {
            revokedTokenRepo.deleteAll(expiredTokens);
            log.info("Cleaned up {} expired blacklisted tokens", expiredTokens.size());
        }
    }
}
