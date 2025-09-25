package com.donkie.quickcart.user.infra.integration.keycloak.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UserRoleData(
        @JsonProperty("id") String roleId,
        @JsonProperty("name") String roleName
) {
}
