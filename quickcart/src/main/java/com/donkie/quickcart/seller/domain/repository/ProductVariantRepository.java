package com.donkie.quickcart.seller.domain.repository;

import com.donkie.quickcart.seller.domain.model.ProductVariant;
import com.donkie.quickcart.shared.jpa.CustomJpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ProductVariantRepository extends CustomJpaRepository<ProductVariant, UUID> {

    // Native query join for efficient update
    @Modifying(clearAutomatically = true)
    @Query(value = """
            UPDATE product_variant pv
            SET is_orphan = TRUE,
                is_active = FALSE,
                last_modified_date = now()
            FROM product p
            WHERE pv.product_id = p.product_id
              AND p.store_id = :storeId
              AND (pv.is_active = TRUE OR pv.is_orphan = FALSE)
            """, nativeQuery = true)
    int markInactiveAndOrphanByStore(@Param("storeId") UUID storeId);

    @Modifying(clearAutomatically = true)
    @Query(value = """
            UPDATE product_variant pv
            SET is_orphan = TRUE,
                is_active = FALSE,
                last_modified_date = now()
            WHERE pv.product_id = :productId
              AND (pv.is_active = TRUE OR pv.is_orphan = FALSE)
            """, nativeQuery = true)
    int markInactiveAndOrphanByProduct(@Param("productId") UUID productId);

    List<ProductVariant> findByProduct_ProductId(UUID productId);

    default List<ProductVariant> findAllActiveByProduct(UUID productId) {
        return findAll((root, q, cb) -> cb.and(
                cb.equal(root.get("product").get("productId"), productId),
                cb.isTrue(root.get("lifecycleAudit").get("isActive")),
                cb.isFalse(root.get("lifecycleAudit").get("isDeleted"))
        ));
    }

}
