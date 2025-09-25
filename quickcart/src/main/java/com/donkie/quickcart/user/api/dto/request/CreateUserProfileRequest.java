package com.donkie.quickcart.user.api.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;

/**
 * Request DTO for creating user profile.
 */
public record CreateUserProfileRequest(
        @JsonProperty("firstName")
        @NotBlank(message = "First name is required")
        String firstName,
        
        @JsonProperty("lastName")
        @NotBlank(message = "Last name is required")
        String lastName,
        
        @JsonProperty("phoneNumber")
        @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Phone number must be valid")
        String phoneNumber
) {
}