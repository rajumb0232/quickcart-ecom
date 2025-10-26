package com.donkie.quickcart.shared.security.util;

import com.donkie.quickcart.user.domain.model.UserRole;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

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
            if(sub != null) {
                try {
                    return UUID.fromString(sub);
                } catch (IllegalArgumentException e) {
                    log.debug("User Unauthenticated, value: '{}'", sub);
                    return null;
                }
            } else return null;
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

    public static boolean doesUserHasRole(UserRole role) {
        return getCurrentUserRoles().contains(role.getDisplayName());
    }
}
