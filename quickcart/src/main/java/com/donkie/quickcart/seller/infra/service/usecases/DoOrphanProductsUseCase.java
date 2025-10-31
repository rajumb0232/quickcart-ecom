package com.donkie.quickcart.seller.infra.service.usecases;

import com.donkie.quickcart.seller.domain.repository.ProductRepository;
import com.donkie.quickcart.seller.domain.repository.ProductVariantRepository;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@AllArgsConstructor
@Slf4j
public class DoOrphanProductsUseCase {
    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;

    @Transactional
    @Retry(name = "dbRetry", fallbackMethod = "onFailure")
    public void execute(UUID storeId) {
        int productsUpdated = productRepository.markInactiveAndOrphanByStore(storeId);
        log.info("Marked {} products inactive/orphan for store {}", productsUpdated, storeId);

        int variantsUpdated = variantRepository.markInactiveAndOrphanByStore(storeId);
        log.info("Marked {} product_variants inactive/orphan for store {}", variantsUpdated, storeId);
    }

    @SuppressWarnings("unused")
    public void onFailure(UUID storeId, Throwable ex) {
        log.error("dbRetry exhausted for store {}", storeId, ex);
        // TODO: Future - persist failure to a 'failed_jobs' table or alert;
    }
}
