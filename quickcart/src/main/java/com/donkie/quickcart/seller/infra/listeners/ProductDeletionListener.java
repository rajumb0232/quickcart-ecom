package com.donkie.quickcart.seller.infra.listeners;

import com.donkie.quickcart.seller.application.events.ProductDeletedEvent;
import com.donkie.quickcart.seller.domain.repository.ProductVariantRepository;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.transaction.event.TransactionPhase;

@Component
@RequiredArgsConstructor
@Slf4j
public class ProductDeletionListener {
    private final ProductVariantRepository variantRepository;

    @Async("eventExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Retry(name = "dbRetry", fallbackMethod = "onFailure")
    public void onProductDeletion(ProductDeletedEvent evt) {
        var productId = evt.productId();
        log.info("Processing product deletion for {}", productId);
        try {
            int updated = variantRepository.markInactiveAndOrphanByProduct(productId);
            log.info("Marked {} variants inactive/orphan for product {}", updated, productId);
        } catch (Exception ex) {
            log.error("Failed processing ProductDeletedEvent for product {}", productId, ex);
        }
    }

    @SuppressWarnings("unused")
    public void onFailure(ProductDeletedEvent evt, Throwable ex) {
        log.error("dbRetry exhausted for product {}", evt.productId(), ex);
    }
}
