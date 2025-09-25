package com.donkie.quickcart.user.api.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;
import java.util.UUID;

/**
 * Response DTO for user profile data.
 */
public record UserProfileResponse(
        @JsonProperty("userId")
        UUID userId,
        
        @JsonProperty("firstName")
        String firstName,
        
        @JsonProperty("lastName")
        String lastName,
        
        @JsonProperty("email")
        String email,
        
        @JsonProperty("createdAt")
        Instant createdAt,
        
        @JsonProperty("updatedAt")
        Instant updatedAt
) {
}