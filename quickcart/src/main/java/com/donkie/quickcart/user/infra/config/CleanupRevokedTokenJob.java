package com.donkie.quickcart.user.infra.config;

import com.donkie.quickcart.user.domain.repository.RevokedTokenRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Configuration
@EnableScheduling
@RequiredArgsConstructor
@Slf4j
public class CleanupRevokedTokenJob {

    private final RevokedTokenRepo revokedTokenRepo;

    /**
     * Clean up expired revoked tokens every minute.
     * Runs at the start of every minute (e.g., 10:00:00, 10:01:00, 10:02:00).
     */
    @Scheduled(cron = "0 * * * * *")  // Every minute at 0 seconds
    @Transactional
    public void cleanupExpiredTokens() {
        log.debug("Starting cleanup of expired revoked tokens");

        try {
            var expiredTokens = revokedTokenRepo.findByExpirationBefore(Instant.now());

            if (!expiredTokens.isEmpty()) {
                revokedTokenRepo.deleteAll(expiredTokens);
                log.info("Cleaned up {} expired revoked tokens", expiredTokens.size());
            } else
                log.debug("No expired tokens to clean up");

        } catch (Exception e) {
            log.error("Error cleaning up expired revoked tokens", e);
        }
    }
}
