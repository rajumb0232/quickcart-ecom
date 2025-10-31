package com.donkie.quickcart.seller.application.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.UUID;

public record ProductResponse (
        @JsonProperty("product_id") UUID productId,
        @JsonProperty("title") String title,
        @JsonProperty("description") String description,
        @JsonProperty("brand") String brand,
        @JsonProperty("category_path") String categoryPath,
        @JsonProperty("variants") List<ProductVariantResponse> variants,
        @JsonProperty("avg_rating") double avgRating,
        @JsonProperty("rating_count") int ratingCount
) {
}
