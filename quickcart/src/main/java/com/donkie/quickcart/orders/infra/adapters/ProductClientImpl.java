package com.donkie.quickcart.orders.infra.adapters;

import com.donkie.quickcart.orders.application.model.ProductSnapshot;
import com.donkie.quickcart.orders.application.model.StoreSnapshot;
import com.donkie.quickcart.orders.application.port.ProductClient;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@AllArgsConstructor
public class ProductClientImpl implements ProductClient {

    @Override
    public ProductSnapshot getProductSnapShot(UUID productVariantId) {
        return null;
    }

    @Override
    public StoreSnapshot getStoreSnapshot(UUID storeId) {
        return null;
    }
}
