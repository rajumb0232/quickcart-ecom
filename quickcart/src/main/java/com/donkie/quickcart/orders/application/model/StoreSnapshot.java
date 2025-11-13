package com.donkie.quickcart.orders.application.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.UUID;

public record StoreSnapshot(
        @JsonProperty("store_id") UUID storeId,
        @JsonProperty("name") String name,
        @JsonProperty("location") String location,
        @JsonProperty("contact_number") String contactNumber,
        @JsonProperty("contact_email") String contactEmail
) {
}
