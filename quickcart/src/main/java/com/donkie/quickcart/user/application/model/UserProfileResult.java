package com.donkie.quickcart.user.application.model;

import com.donkie.quickcart.user.domain.model.SellerProfile;
import com.donkie.quickcart.user.domain.model.UserProfile;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

public final class UserProfileResult {

    /* ===================== Polymorphic role blocks ===================== */

    public sealed interface RoleProfile permits SellerProfileDetail, AdminProfileDetail, CustomerProfileDetail {
    }

    public record CustomerProfileDetail() implements RoleProfile {
    }

    public record SellerProfileDetail(
            String bio,
            Instant sellingSince
    ) implements RoleProfile {
    }

    @Schema(name = "AdminProfile", description = "Admin-specific profile information")
    public record AdminProfileDetail(
            // Add fields when AdminProfile entity is available
    ) implements RoleProfile {
    }

    /* ===================== Common DTOs ===================== */

    public record Detail(
            UUID userId,
            String firstName,
            String lastName,
            String email,
            Instant createdDate,
            Instant lastModifiedDate,
            List<RoleProfile> profiles
    ) {
    }


    /* ===================== Factory methods ===================== */

    public static Detail buildDetailResponse(UserProfile u) {
        Objects.requireNonNull(u, "userProfile");
        return new Detail(
                u.getUserId(),
                u.getFirstName(),
                u.getLastName(),
                u.getEmail(),
                u.getCreateDate(),
                u.getLastModifiedDate(),
                List.of(new CustomerProfileDetail())
        );
    }

    public static Detail buildDetailResponse(SellerProfile sellerProfile) {
        Objects.requireNonNull(sellerProfile, "sellerProfile cannot be null");
        UserProfile u = Objects.requireNonNull(sellerProfile.getUserProfile(), "UserProfile cannot be null");

        return new Detail(
                u.getUserId(),
                u.getFirstName(),
                u.getLastName(),
                u.getEmail(),
                u.getCreateDate(),
                u.getLastModifiedDate(),
                List.of(
                        new CustomerProfileDetail(),
                        new SellerProfileDetail(
                                sellerProfile.getBio(),
                                sellerProfile.getSellingSince()
                        ))
        );
    }
}
