package com.donkie.quickcart.user.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum UserRole {
    CUSTOMER("customer"),
    SELLER("seller"),
    ADMIN("admin");

    private final String displayName;
}
