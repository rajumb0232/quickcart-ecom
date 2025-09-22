package com.donkie.quickcart.user.application.model;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public final class UserProfileResult {

    public record Detail(
            UUID userId,
            String first_name,
            String last_name,
            String email,
            LocalDate dateOfBirth,
            Instant createdDate,
            Instant lastModifiedDate
    ) {}
}
