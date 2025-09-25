package com.donkie.quickcart.user.infra.integration.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public record KeycloakUserData(
        @JsonProperty("id") String userId,
        @JsonProperty("username") String username,
        @JsonProperty("email") String email
) {
}
