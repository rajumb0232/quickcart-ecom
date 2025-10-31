package com.donkie.quickcart.seller.infra.service.usecases;

import com.donkie.quickcart.seller.domain.repository.ProductRepository;
import com.donkie.quickcart.seller.domain.repository.ProductVariantRepository;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@AllArgsConstructor
public class DoOrphanProductVariantsUseCase {
    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;

    @Transactional
    @Retry(name = "dbRetry", fallbackMethod = "onFailure")
    public void execute(UUID productId) {
        int updated = variantRepository.markInactiveAndOrphanByProduct(productId);
        log.info("Marked {} variants inactive/orphan for product {}", updated, productId);
    }

    @SuppressWarnings("unused")
    public void onFailure(UUID productId, Throwable ex) {
        log.error("dbRetry exhausted for product {}", productId, ex);
    }
}
