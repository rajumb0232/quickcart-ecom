package com.donkie.quickcart.shared.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
public class CurrentUser {

    private CurrentUser() {
        // Class is for utility purpose only
    }

    public static Optional<UUID> getCurrentUserId() {
        return getAuthentication().map(auth -> {
            var sub = auth.getName();
            if(sub != null) return UUID.fromString(sub);
            else return null;
        });
    }

    public static Optional<Authentication> getAuthentication() {
        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication());
    }

    public static List<String> getCurrentUserRoles() {
        return getAuthentication().map(auth -> auth.getAuthorities()
                        .stream().map(GrantedAuthority::getAuthority).toList())
                .orElse(List.of());
    }

    public static boolean doesUserHasRole(String role) {
        return getCurrentUserRoles().contains(role);
    }
}
