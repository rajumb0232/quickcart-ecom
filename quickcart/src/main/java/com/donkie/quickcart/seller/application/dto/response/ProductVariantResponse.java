package com.donkie.quickcart.seller.application.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public record ProductVariantResponse(
        @JsonProperty("variant_id") UUID variantId,
        @JsonProperty("title") String title,
        @JsonProperty("price") double price,
        @JsonProperty("quantity") int quantity,
        @JsonProperty("description") String description,
        @JsonProperty("attributes") Map<String, String> attributes,
        @JsonProperty("created_date") Instant createdDate,
        @JsonProperty("last_modified_date") Instant lastModifiedDate
) {
}
