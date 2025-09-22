package com.donkie.quickcart.user.infra.integration.model;

import java.util.UUID;

public record UserCredentials(
        UUID userId,
        String email
) {
}
