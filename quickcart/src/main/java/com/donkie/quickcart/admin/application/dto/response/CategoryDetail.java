package com.donkie.quickcart.admin.application.dto.response;

import com.donkie.quickcart.admin.application.model.CategoryResult;
import com.donkie.quickcart.admin.domain.model.CategoryStatus;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.UUID;

public record CategoryDetail(
        @JsonProperty("category_id") UUID categoryId,
        @JsonProperty("name") String name,
        @JsonProperty("status") CategoryStatus categoryStatus,
        @JsonProperty("category_level") Integer categoryLevel,
        @JsonProperty("icon_url") String iconUrl,
        @JsonProperty("child_category") List<CategoryDetail> childCategory
) {
}
