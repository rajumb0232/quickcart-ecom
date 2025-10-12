package com.donkie.quickcart.user.infra.service.helper;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.function.Supplier;

@Component
@Slf4j
public class GetWithRetries {

    public <T> T get(Supplier<T> supplier, int maxRetryAttempts, long retryDelayMs) {
        for (int attempt = 1; attempt <= maxRetryAttempts; attempt++) {
            try {
                if (attempt > 1) {
                    Thread.sleep(retryDelayMs * attempt); // Exponential backoff
                }
                T t = supplier.get();
                if(t != null) {
                    log.debug("Successfully retrieved data on attempt {}", attempt);
                    return t;
                }
                log.debug("Data not found on attempt {}", attempt);

            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Interrupted while waiting for data", e);
            } catch (Exception e) {
                log.warn("Failed to retrieve data", e);
                if (attempt == maxRetryAttempts) {
                    throw e;
                }
            }
        }
        throw new RuntimeException("Data not found, attempted " + maxRetryAttempts + " times");
    }
}
