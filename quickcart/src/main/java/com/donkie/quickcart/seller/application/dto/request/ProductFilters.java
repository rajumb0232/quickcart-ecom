package com.donkie.quickcart.seller.application.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ProductFilters(
        @JsonProperty("brand") String brand,
        @JsonProperty("categories") String[] categories,
        @JsonProperty("rating") Double rating,
        @JsonProperty("min_price") Double minPrice,
        @JsonProperty("max_price") Double maxPrice
) {
}
