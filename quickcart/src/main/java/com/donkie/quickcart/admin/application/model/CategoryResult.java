package com.donkie.quickcart.admin.application.model;

import com.donkie.quickcart.admin.domain.model.CategoryStatus;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.UUID;

public class CategoryResult {

    public record Detail (
           @JsonProperty("category_id") UUID categoryId,
           @JsonProperty("name") String name,
           @JsonProperty("status") CategoryStatus categoryStatus,
           @JsonProperty("child_category") List<Detail> childCategory
    ){
    }

    public record Summary (
           @JsonProperty("category_id") UUID categoryId,
           @JsonProperty("name") String name,
           @JsonProperty("status") CategoryStatus categoryStatus
    ){
    }
}
