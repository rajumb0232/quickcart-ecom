package com.donkie.quickcart.seller.application.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ProductRequest(
        @JsonProperty("title") String title,
        @JsonProperty("description") String description,
        @JsonProperty("brand") String brand
) {
}
