package com.donkie.quickcart.admin.application.dto.request;

import com.donkie.quickcart.admin.domain.model.CategoryStatus;
import com.fasterxml.jackson.annotation.JsonProperty;

public record CategoryUpdateRequest(
        @JsonProperty("name") String name,
        @JsonProperty("status") CategoryStatus categoryStatus
) {
}
