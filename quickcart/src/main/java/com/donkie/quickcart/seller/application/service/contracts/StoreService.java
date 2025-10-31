package com.donkie.quickcart.seller.application.service.contracts;

import com.donkie.quickcart.seller.application.dto.request.StoreWrite;
import com.donkie.quickcart.seller.application.dto.response.StoreDetails;

import java.util.UUID;

public interface StoreService {

    UUID createStore(StoreWrite write);

    StoreDetails updateStore(UUID storeId, StoreWrite write);

    StoreDetails getStoreDetails(UUID storeId);

    void deleteStore(UUID storeId);
}
