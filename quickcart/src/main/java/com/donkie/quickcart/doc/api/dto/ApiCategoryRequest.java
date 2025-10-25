package com.donkie.quickcart.doc.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ApiCategoryRequest(
        @JsonProperty("name") String name,
        @JsonProperty("description") String description,
        @JsonProperty("display_order") Integer displayOrder
) {
}
