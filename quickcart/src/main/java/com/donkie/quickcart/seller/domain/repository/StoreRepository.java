package com.donkie.quickcart.seller.domain.repository;

import com.donkie.quickcart.seller.domain.model.Store;
import com.donkie.quickcart.shared.jpa.CustomJpaRepository;

import java.util.UUID;

public interface StoreRepository extends CustomJpaRepository<Store, UUID> {
}
