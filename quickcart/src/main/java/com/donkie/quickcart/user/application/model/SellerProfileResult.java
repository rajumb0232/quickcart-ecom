package com.donkie.quickcart.user.application.model;

import java.time.Instant;
import java.util.UUID;

public final class SellerProfileResult {

    public record Detail(
            UUID userId,
            String first_name,
            String last_name,
            String email,
            String bio,
            Instant selling_since,
            Instant createdDate,
            Instant lastModifiedDate
    ) { }
}
