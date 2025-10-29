package com.donkie.quickcart.admin.application.model;

import com.donkie.quickcart.admin.domain.model.CategoryStatus;

import java.util.List;
import java.util.UUID;

public class CategoryResult {

    public record Detail(
            UUID categoryId,
            String name,
            CategoryStatus categoryStatus,
            List<Detail> childCategory
    ) {
    }

    public record Summary(
            UUID categoryId,
            String name,
            CategoryStatus categoryStatus
    ) {
    }
}
