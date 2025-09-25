package com.donkie.quickcart.shared.dto;

public record FieldError(
        String field,
        Object rejectedValue,
        String message
) {
}
