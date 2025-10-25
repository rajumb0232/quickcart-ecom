package com.donkie.quickcart.doc.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.UUID;

public record ApiCategoryResponse(
        @JsonProperty("category_id") UUID categoryId,
        @JsonProperty("name") String name,
        @JsonProperty("description") String description,
        @JsonProperty("display_order") Integer displayOrder,
        @JsonProperty("endpoints") List<ApiEndpointDetail> endpoints
) {
}
