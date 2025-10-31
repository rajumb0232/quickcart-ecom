package com.donkie.quickcart.seller.infra.listeners;

import com.donkie.quickcart.seller.application.events.StoreDeletedEvent;
import com.donkie.quickcart.seller.domain.repository.ProductRepository;
import com.donkie.quickcart.seller.domain.repository.ProductVariantRepository;
import com.donkie.quickcart.seller.infra.service.usecases.DoOrphanProductsUseCase;
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
    private final DoOrphanProductsUseCase doOrphanProducts;

    @Async("eventExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT) // Runs AFTER commit and asynchronously on the 'eventExecutor' thread pool
    public void onStoreDeletion(StoreDeletedEvent evt) {
        UUID storeId = evt.storeId();
        log.info("Processing store deletion for {}", storeId);

        doOrphanProducts.execute(storeId);
    }
}
