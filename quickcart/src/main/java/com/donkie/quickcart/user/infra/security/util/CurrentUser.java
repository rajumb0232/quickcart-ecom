package com.donkie.quickcart.user.infra.security.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.security.Principal;
import java.util.Objects;
import java.util.Optional;

public class CurrentUser {

    private CurrentUser() {
        // Class is for utility purpose only
    }

    public static Optional<String> getCurrentUsername() {
        return getAuthentication().map(Principal::getName);
    }

    private static Optional<Authentication> getAuthentication() {
        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication());
    }
}
