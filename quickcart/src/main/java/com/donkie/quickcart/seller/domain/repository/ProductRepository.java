package com.donkie.quickcart.seller.domain.repository;

import com.donkie.quickcart.seller.domain.model.Product;
import com.donkie.quickcart.shared.jpa.CustomJpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface ProductRepository extends CustomJpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {

    @Modifying(clearAutomatically = true)
    @Query(""" 
            UPDATE Product p
            SET p.lifecycleAudit.isOrphan = TRUE,
                p.lifecycleAudit.isActive = FALSE,
                p.lifecycleAudit.isDeleted = TRUE,
                p.lifecycleAudit.lastModifiedDate = CURRENT_TIMESTAMP
            WHERE p.store.storeId = :storeId
             AND (p.lifecycleAudit.isActive = TRUE OR p.lifecycleAudit.isOrphan = FALSE)
            """)
    int markInactiveAndOrphanByStore(@Param("storeId") UUID storeId);
}
