package com.donkie.quickcart.seller.application.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Map;

public record ProductVariantRequest (
        @JsonProperty("title") String title,
        @JsonProperty("price") double price,
        @JsonProperty("quantity") int quantity,
        @JsonProperty("description") String description,
        @JsonProperty("attributes") Map<String, String> attributes
) {
}
