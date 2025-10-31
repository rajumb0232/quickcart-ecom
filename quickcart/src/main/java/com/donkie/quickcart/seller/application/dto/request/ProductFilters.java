package com.donkie.quickcart.seller.application.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ProductFilters(
        @JsonProperty("brand") String brand,
        @JsonProperty("categories") String[] categories,
        @JsonProperty("rating") double rating,
        @JsonProperty("min_prize") double minPrize,
        @JsonProperty("max_prize") double maxPrize
) {
}
