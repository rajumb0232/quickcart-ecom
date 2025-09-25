package com.donkie.quickcart.shared.dto;

import java.util.List;

public record ApiValidationError(
        boolean success,
        String message,
        List<FieldError> errors
) {
    public static ApiValidationError of(String message, List<FieldError> errors) {
        return new ApiValidationError(false, message, errors);
    }
}
