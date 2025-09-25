package com.donkie.quickcart.user.api.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Pattern;

/**
 * Request DTO for updating user profile.
 * All fields are optional for partial updates.
 */
public record UpdateUserProfileRequest(
        @JsonProperty("firstName")
        String firstName,
        
        @JsonProperty("lastName")
        String lastName,
        
        @JsonProperty("phoneNumber")
        @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Phone number must be valid")
        String phoneNumber
) {
}