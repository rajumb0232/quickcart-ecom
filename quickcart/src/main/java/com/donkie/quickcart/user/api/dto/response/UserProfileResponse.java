package com.donkie.quickcart.user.api.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Public API response: base user fields + polymorphic role blocks.
 */
@Schema(description = "User profile response returned to API clients")
public record UserProfileResponse(
        @JsonProperty("user_id") UUID userId,
        @JsonProperty("first_name") String firstName,
        @JsonProperty("last_name") String lastName,
        @JsonProperty("email") String email,
        @JsonProperty("created_at") Instant createdAt,
        @JsonProperty("updated_at") Instant updatedAt,

        @JsonProperty("profiles")
        @ArraySchema(
                arraySchema = @Schema(description = "Role-specific blocks (discriminated by 'type')"),
                schema = @Schema(oneOf = {
                        UserRoleProfile.SellerRole.class,
                        UserRoleProfile.CustomerRole.class,
                        UserRoleProfile.AdminRole.class
                })
        )
        List<UserRoleProfile.Role> roleProfile
) {
}
