package com.donkie.quickcart.user.api.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;

/**
 * Container for role polymorphism (Jackson + OpenAPI)
 */
public final class UserRoleProfile {

    @Schema(
            description = "Role-specific block; 'role' is the discriminator",
            discriminatorProperty = "role",
            oneOf = {SellerRole.class, CustomerRole.class, AdminRole.class}
    )
    @JsonTypeInfo(
            use = JsonTypeInfo.Id.NAME,
            include = JsonTypeInfo.As.PROPERTY,
            property = "role" // "seller" | "customer" | "admin"
    )
    @JsonSubTypes({
            @JsonSubTypes.Type(value = SellerRole.class, name = "seller"),
            @JsonSubTypes.Type(value = CustomerRole.class, name = "customer"),
            @JsonSubTypes.Type(value = AdminRole.class, name = "admin")
    })
    public sealed interface Role permits SellerRole, CustomerRole, AdminRole {
    }

    @Schema(name = "SellerRole", description = "Seller-specific profile info")
    public record SellerRole(
            @JsonProperty("bio") String bio,
            @JsonProperty("selling_since") Instant sellingSince
    ) implements Role {
    }

    @Schema(name = "CustomerRole", description = "Customer role (no extra fields yet)")
    public record CustomerRole() implements Role {
    }

    @Schema(name = "AdminRole", description = "Admin role (reserved for future use)")
    public record AdminRole() implements Role {
    }
}
