package com.donkie.quickcart.user.application.model;

import java.time.Instant;
import java.util.UUID;

public final class UserProfileResult {

    public record Detail(
            UUID userId,
            String firstName,
            String lastName,
            String email,
            Instant createdDate,
            Instant lastModifiedDate
    ) {}
}
