package com.donkie.quickcart.seller.application.service.util;

import com.donkie.quickcart.seller.domain.model.Product;
import com.donkie.quickcart.seller.domain.model.ProductVariant;
import com.donkie.quickcart.seller.application.dto.request.ProductFilters;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.Objects;

public final class ProductSpecifications {

    private ProductSpecifications() {}

    public static Specification<Product> byFilters(ProductFilters filters) {
        Specification<Product> spec = Specification.unrestricted();

        // Always require active and not deleted products
        spec = spec.and((root, query, cb) -> cb.and(
                cb.isTrue(root.get("lifecycleAudit").get("isActive")),
                cb.isFalse(root.get("lifecycleAudit").get("isDeleted"))
        ));

        if (filters == null) {
            return spec;
        }

        // brand (null/empty safe)
        if (StringUtils.hasText(filters.brand())) {
            String brand = filters.brand().trim().toLowerCase();
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("brand")), "%" + escapeLike(brand) + "%"));
        }

        // categories -> match against categoryPath (null/empty safe)
        if (filters.categories() != null && filters.categories().length > 0) {
            String[] cats = Arrays.stream(filters.categories())
                    .filter(StringUtils::hasText)
                    .map(String::trim)
                    .toArray(String[]::new);

            if (cats.length > 0) {
                spec = spec.and((root, query, cb) -> {
                    query.distinct(true);
                    var predicates = Arrays.stream(cats)
                            .map(cat -> cb.like(cb.lower(root.get("categoryPath")), "%" + cat.toLowerCase() + "%"))
                            .toArray(jakarta.persistence.criteria.Predicate[]::new);
                    return cb.or(predicates);
                });
            }
        }

        // rating (nullable Double)
        if (Objects.nonNull(filters.rating())) {
            Double rating = filters.rating();
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("avgRating"), rating));
        }

        // price range — join variants and also filter their lifecycle (nullable Doubles)
        Double min = filters.minPrice();
        Double max = filters.maxPrice();
        boolean hasMin = Objects.nonNull(min);
        boolean hasMax = Objects.nonNull(max);

        if (hasMin || hasMax) {
            spec = spec.and((root, query, cb) -> {
                Join<Product, ProductVariant> variants = root.join("variants", JoinType.INNER);
                query.distinct(true);

                // variant lifecycle constraints
                var variantActive = cb.isTrue(variants.get("lifecycleAudit").get("isActive"));
                var variantNotDeleted = cb.isFalse(variants.get("lifecycleAudit").get("isDeleted"));
                jakarta.persistence.criteria.Predicate lifecyclePred = cb.and(variantActive, variantNotDeleted);

                jakarta.persistence.criteria.Predicate pricePred;
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
