package com.donkie.quickcart.seller.application.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ProductByVariantResponse(
        @JsonProperty("product_id") UUID productId,
        @JsonProperty("title") String title,
        @JsonProperty("description") String description,
        @JsonProperty("brand") String brand,
        @JsonProperty("category_path") String categoryPath,
        @JsonProperty("avg_rating") double avgRating,
        @JsonProperty("rating_count") int ratingCount,
        @JsonProperty("created_date") Instant createdDate,
        @JsonProperty("last_modified_date") Instant lastModifiedDate,
        @JsonProperty("variant") ProductVariantResponse variant,
        @JsonProperty("is_active") boolean isActive,
        @JsonProperty("is_deleted") boolean isDeleted
) {
}
