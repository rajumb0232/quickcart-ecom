package com.donkie.quickcart.user.infra.integration.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AdminTokenResult(
        @JsonProperty("access_token") String accessToken,
        @JsonProperty("expires_in") int expiresIn
) {
}