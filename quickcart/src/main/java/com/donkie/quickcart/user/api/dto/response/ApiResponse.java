package com.donkie.quickcart.user.api.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

/**
 * Generic API response wrapper.
 */
public record ApiResponse<T>(
        @JsonProperty("success")
        boolean success,
        
        @JsonProperty("message")
        String message,
        
        @JsonProperty("data")
        T data,
        
        @JsonProperty("timestamp")
        LocalDateTime timestamp
) {
    
    /**
     * Creates a successful response with data.
     */
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "Success", data, LocalDateTime.now());
    }
    
    /**
     * Creates a successful response with custom message.
     */
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data, LocalDateTime.now());
    }
    
    /**
     * Creates a successful response without data.
     */
    public static ApiResponse<Void> success(String message) {
        return new ApiResponse<>(true, message, null, LocalDateTime.now());
    }
    
    /**
     * Creates an error response.
     */
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null, LocalDateTime.now());
    }
}