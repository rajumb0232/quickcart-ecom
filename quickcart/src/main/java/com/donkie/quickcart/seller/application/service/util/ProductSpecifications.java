package com.donkie.quickcart.seller.application.service.util;

import com.donkie.quickcart.seller.domain.model.Product;
import com.donkie.quickcart.seller.domain.model.ProductVariant;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.UUID;

public final class ProductSpecifications {

    private ProductSpecifications() {}

    public static Specification<Product> byFilters(ProductSpecs productSpecs) {
        Specification<Product> spec = Specification.unrestricted();

        // Active and not deleted filter
        spec = spec.and((root, query, cb) -> cb.and(
                cb.isTrue(root.get("lifecycleAudit").get("isActive")),
                cb.isFalse(root.get("lifecycleAudit").get("isDeleted"))
        ));

        if (productSpecs == null) {
            return spec;
        }

        if (StringUtils.hasText(productSpecs.brand())) {
            String brand = productSpecs.brand().trim().toLowerCase();
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("brand")), "%" + escapeLike(brand) + "%"));
        }

        if (productSpecs.categoryIds() != null && !productSpecs.categoryIds().isEmpty()) {
            spec = spec.and((root, query, cb) -> {
                assert query != null;
                query.distinct(true);
                CriteriaBuilder.In<UUID> inClause = cb.in(root.get("categoryId"));
                for (UUID categoryId : productSpecs.categoryIds()) {
                    inClause.value(categoryId);
                }
                return inClause;
            });
        }

        if (productSpecs.rating() != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("avgRating"), productSpecs.rating()));
        }

        Double min = productSpecs.minPrice();
        Double max = productSpecs.maxPrice();
        boolean hasMin = min != null;
        boolean hasMax = max != null;

        if (hasMin || hasMax) {
            spec = spec.and((root, query, cb) -> {
                Join<Product, ProductVariant> variants = root.join("variants", JoinType.INNER);
                assert query != null;
                query.distinct(true);

                Predicate variantActive = cb.isTrue(variants.get("lifecycleAudit").get("isActive"));
                Predicate variantNotDeleted = cb.isFalse(variants.get("lifecycleAudit").get("isDeleted"));
                Predicate lifecyclePred = cb.and(variantActive, variantNotDeleted);

                Predicate pricePred;
                if (hasMin && hasMax) {
                    pricePred = cb.between(variants.get("price"), min, max);
                } else if (hasMin) {
                    pricePred = cb.greaterThanOrEqualTo(variants.get("price"), min);
                } else {
                    pricePred = cb.lessThanOrEqualTo(variants.get("price"), max);
                }

                return cb.and(lifecyclePred, pricePred);
            });
        }

        return spec;
    }


    private static String escapeLike(String input) {
        return input.replace("\\", "\\\\").replace("_", "\\_").replace("%", "\\%");
    }
}
