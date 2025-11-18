package com.donkie.quickcart.seller.application.service.contracts;


import com.donkie.quickcart.seller.adapters.dto.ProductSnapshot;
import com.donkie.quickcart.seller.adapters.dto.StoreSnapshot;

import java.util.UUID;

public interface ResourceSnapService {

    ProductSnapshot getProductVariantSnapshot(UUID variantId);

    StoreSnapshot getStoreSnapshot(UUID storeId);
}
