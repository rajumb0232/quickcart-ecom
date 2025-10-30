package com.donkie.quickcart.admin.application.dto.response;

import com.donkie.quickcart.admin.domain.model.CategoryStatus;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.UUID;

public record CategorySummary(
        @JsonProperty("category_id") UUID categoryId,
        @JsonProperty("name") String name,
        @JsonProperty("status") CategoryStatus categoryStatus,
        @JsonProperty("category_level") Integer categoryLevel,
        @JsonProperty("thumbnail_id") String thumbnailId
) {
}
