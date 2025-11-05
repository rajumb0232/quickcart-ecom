package com.donkie.quickcart.seller.domain.repository;

import com.donkie.quickcart.seller.domain.model.Store;
import com.donkie.quickcart.shared.jpa.CustomJpaRepository;

import java.util.List;
import java.util.UUID;

public interface StoreRepository extends CustomJpaRepository<Store, UUID> {
    List<Store> findByLifecycleAudit_CreatedBy(String createdBy);
}
