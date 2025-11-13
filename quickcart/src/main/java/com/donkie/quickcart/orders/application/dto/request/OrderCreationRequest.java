package com.donkie.quickcart.orders.application.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record OrderCreationRequest(
        @JsonProperty("shipping_address") String shippingAddress
) {
}
