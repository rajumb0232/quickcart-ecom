package com.donkie.quickcart.shared.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ApiError(
        @JsonProperty("success") boolean success,
        @JsonProperty("message") String message,
        @JsonProperty("cause") String cause
) {

    public static final String COULDN_T_FIND_ROOT_CAUSE = "Sorry, couldn't find root cause.";

    public static ApiError build(String message, Throwable ex) {
        return new ApiError(false, message, resolveCause(ex));
    }

    private static String resolveCause(Throwable t) {
        if(t == null)
            return COULDN_T_FIND_ROOT_CAUSE;

        return t.getMessage() != null ? t.getMessage() : COULDN_T_FIND_ROOT_CAUSE;
    }
}
