package com.donkie.quickcart.seller.infra.listeners;

import com.donkie.quickcart.seller.application.events.ProductDeletedEvent;
import com.donkie.quickcart.seller.domain.repository.ProductVariantRepository;
import com.donkie.quickcart.seller.infra.service.usecases.DoOrphanProductVariantsUseCase;
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
    private final DoOrphanProductVariantsUseCase doOrphanProductVariants;

    @Async("eventExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onProductDeletion(ProductDeletedEvent evt) {
        var productId = evt.productId();
        log.info("Processing product deletion for {}", productId);

        doOrphanProductVariants.execute(productId);
    }
}
