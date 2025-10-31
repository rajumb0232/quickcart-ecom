package com.donkie.quickcart.seller.infra.listeners;

import com.donkie.quickcart.seller.application.events.StoreDeletedEvent;
import com.donkie.quickcart.seller.domain.repository.ProductRepository;
import com.donkie.quickcart.seller.domain.repository.ProductVariantRepository;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.transaction.event.TransactionPhase;

import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class StoreDeletionListener {
    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;

    @Async("eventExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT) // Runs AFTER commit and asynchronously on the 'eventExecutor' thread pool
    @Retry(name = "dbRetry", fallbackMethod = "onFailure")
    public void onStoreDeletion(StoreDeletedEvent evt) {
        UUID storeId = evt.storeId();
        log.info("Processing store deletion for {}", storeId);

        try {
            // 1) Bulk update products: mark inactive and orphan
            int productsUpdated = productRepository.markInactiveAndOrphanByStore(storeId);
            log.info("Marked {} products inactive/orphan for store {}", productsUpdated, storeId);

            // 2) Bulk update variants — variant repo can update via join to product
            int variantsUpdated = variantRepository.markInactiveAndOrphanByStore(storeId);
            log.info("Marked {} product_variants inactive/orphan for store {}", variantsUpdated, storeId);

        } catch (Exception ex) {
            log.error("Failed processing StoreDeletionEvent for store {}", storeId, ex);
        }
    }

    @SuppressWarnings("unused")
    public void onFailure(StoreDeletedEvent evt, Throwable ex) {
        log.error("dbRetry exhausted for store {}", evt.storeId(), ex);
        // TODO: Future - persist failure to a 'failed_jobs' table or alert;
    }
}
