package com.donkie.quickcart.orders.infra.adapters;

import com.donkie.quickcart.orders.application.model.ProductSnapshot;
import com.donkie.quickcart.orders.application.model.StoreSnapshot;
import com.donkie.quickcart.orders.application.port.ProductClient;
import com.donkie.quickcart.seller.application.service.contracts.ResourceSnapService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@AllArgsConstructor
public class ProductClientImpl implements ProductClient {
    private final ResourceSnapService resourceSnapService;

    @Override
    public ProductSnapshot getProductSnapShot(UUID productVariantId) {
        var snap = resourceSnapService.getProductVariantSnapshot(productVariantId);
        return new ProductSnapshot(
                snap.productId(),
                snap.variantId(),
                snap.productTitle(),
                snap.variantTitle(),
                snap.pricePerUnit(),
                snap.thumbnail()
        );
    }

    @Override
    public StoreSnapshot getStoreSnapshot(UUID storeId) {
        var snap = resourceSnapService.getStoreSnapshot(storeId);
        return new StoreSnapshot(
                snap.storeId(),
                snap.name(),
                snap.location(),
                snap.contactNumber(),
                snap.contactEmail(),
                snap.ownerId()
        );
    }
}
