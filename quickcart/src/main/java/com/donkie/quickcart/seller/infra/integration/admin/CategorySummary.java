package com.donkie.quickcart.seller.infra.integration.admin;

import com.donkie.quickcart.admin.domain.model.CategoryStatus;

import java.util.UUID;

public record CategorySummary(
        UUID categoryId,
        String name,
        CategoryStatus categoryStatus,
        Integer categoryLevel
) {
}
