package com.donkie.quickcart.shared.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record PageResponse<T>(
        @JsonProperty("success") boolean success,
        @JsonProperty("message") String message,
        @JsonProperty("page") PageContainer<T> page
) {
    public static <T> PageResponse<T> create(String message, PageContainer<T> page) {
        return new PageResponse<>(true, message, page);
    }
}
