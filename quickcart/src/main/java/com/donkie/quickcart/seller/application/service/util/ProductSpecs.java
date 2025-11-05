package com.donkie.quickcart.seller.application.service.util;

import java.util.List;
import java.util.UUID;

public record ProductSpecs(
        String brand,
        List<UUID> categoryIds,
        Double rating,
        Double minPrice,
        Double maxPrice
) {
}
