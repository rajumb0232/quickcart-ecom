package com.donkie.quickcart.doc.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.UUID;

public record ApiEndpointDetail(
        @JsonProperty("endpoint_id") UUID endpointId,
        @JsonProperty("title") String title,
        @JsonProperty("display_order") Integer displayOrder,
        @JsonProperty("content") String content
) {
}
