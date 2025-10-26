package com.donkie.quickcart.doc.api.dto;

import com.donkie.quickcart.doc.domain.model.HttpMethod;
import com.fasterxml.jackson.annotation.JsonProperty;

public record ApiEndpointRequest(
        @JsonProperty("title") String title,
        @JsonProperty("markdown") String markdown,
        @JsonProperty("display_order") Integer displayOrder,
        @JsonProperty("method") HttpMethod method
) {
}
