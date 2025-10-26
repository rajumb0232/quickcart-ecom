package com.donkie.quickcart.doc.api.dto;

import com.donkie.quickcart.doc.domain.model.HttpMethod;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.UUID;

public record ApiEndpointSummary(
        @JsonProperty("endpoint_id") UUID endpointId,
        @JsonProperty("title") String title,
        @JsonProperty("display_order") Integer displayOrder,
        @JsonProperty("method") HttpMethod method
) {
}
