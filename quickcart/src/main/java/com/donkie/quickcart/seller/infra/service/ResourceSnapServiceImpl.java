package com.donkie.quickcart.seller.infra.service;

import com.donkie.quickcart.seller.adapters.dto.ProductSnapshot;
import com.donkie.quickcart.seller.adapters.dto.StoreSnapshot;
import com.donkie.quickcart.seller.application.exception.ProductVariantNotFoundException;
import com.donkie.quickcart.seller.application.exception.StoreNotFoundException;
import com.donkie.quickcart.seller.application.service.contracts.ResourceSnapService;
import com.donkie.quickcart.seller.domain.repository.ProductVariantRepository;
import com.donkie.quickcart.seller.domain.repository.StoreRepository;
import com.donkie.quickcart.uploads.domain.model.ImageFile;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@AllArgsConstructor
public class ResourceSnapServiceImpl implements ResourceSnapService {
    private final ProductVariantRepository variantRepository;
    private final StoreRepository storeRepository;

    @Transactional
    @Override
    public ProductSnapshot getProductVariantSnapshot(UUID variantId) {
        return variantRepository.findActiveById(variantId)
                .map(pv -> {
                    var product = pv.getProduct();
                    var thumbnail = pv.getImages().stream().findFirst()
                            .map(ImageFile::getImageId)
                            .map(id -> "/api/v1/public/products/variants/images/" + id)
                            .orElse(null);

                    return new ProductSnapshot(
                            product.getProductId(),
                            pv.getVariantId(),
                            product.getTitle(),
                            pv.getTitle(),
                            pv.getPrice(),
                            thumbnail
                    );
                })
                .orElseThrow(() -> new ProductVariantNotFoundException(HttpStatus.NOT_FOUND, "Product variant not found"));
    }

    @Override
    public StoreSnapshot getStoreSnapshot(UUID storeId) {
        return storeRepository.findById(storeId)
                .map(store -> {
                    UUID id = null;
                    try {
                        id = UUID.fromString(store.getLifecycleAudit().getCreatedBy());
                    } catch (Exception e) {
                        log.error("Failed to parse store creator ID: {}", store.getLifecycleAudit().getCreatedBy(), e);
                    }
                    return new StoreSnapshot(
                            store.getStoreId(),
                            store.getName(),
                            store.getLocation(),
                            store.getContactNumber(),
                            store.getEmail(),
                            id
                    );
                })
                .orElseThrow(() -> new StoreNotFoundException(HttpStatus.NOT_FOUND, "Store not found"));
    }
}
