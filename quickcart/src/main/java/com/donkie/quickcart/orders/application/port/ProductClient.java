package com.donkie.quickcart.orders.application.port;

import com.donkie.quickcart.orders.application.model.ProductSnapshot;
import com.donkie.quickcart.orders.application.model.StoreSnapshot;

import java.util.UUID;

public interface ProductClient {

    ProductSnapshot getProductSnapShot(UUID productVariantId);

    StoreSnapshot getStoreSnapshot(UUID storeId);
}
