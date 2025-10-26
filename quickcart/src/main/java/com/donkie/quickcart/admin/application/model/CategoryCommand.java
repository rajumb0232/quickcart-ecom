package com.donkie.quickcart.admin.application.model;

import com.donkie.quickcart.admin.domain.model.CategoryStatus;
import com.fasterxml.jackson.annotation.JsonProperty;

public class CategoryCommand {

    public record Create(
            @JsonProperty("name") String name
    ) {
    }

    public record Update(
            @JsonProperty("name") String name,
            @JsonProperty("status") CategoryStatus categoryStatus
    ) {
    }
}
