package com.donkie.quickcart.doc.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.UUID;

public record ApiCategorySummary(
        @JsonProperty("category_id")
        UUID categoryId,
        @JsonProperty("name") String name,
        @JsonProperty("description") String description,
        @JsonProperty("display_order") Integer displayOrder
) {
}
