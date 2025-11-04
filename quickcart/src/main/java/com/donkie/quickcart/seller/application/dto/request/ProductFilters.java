package com.donkie.quickcart.seller.application.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ProductFilters(
        @JsonProperty("brand") String brand,
        @JsonProperty("categories") String[] categories,
        @JsonProperty("rating") Double rating,
        @JsonProperty("min_prize") Double minPrize,
        @JsonProperty("max_prize") Double maxPrize
) {
}
