package com.donkie.quickcart.shared.security.util;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;

import java.util.UUID;

@Slf4j
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class OwnershipEvaluator {

    public static boolean isOwner(String createdBy) {
        if (createdBy == null || createdBy.isBlank()) {
            log.warn("Illegal Argument, createdBy is null or blank.");
            throw new AccessDeniedException("Missing ownership information.");
        }

        return CurrentUser.getCurrentUserId()
                .map(UUID::toString)
                .filter(createdBy::equalsIgnoreCase)
                .isPresent();
    }

    public static void ensureOwnership(String createdBy) {
        if (!isOwner(createdBy)) {
            log.warn("Illegal Access, createdBy does not match the current user.");
            throw new AccessDeniedException("You do not have access to this resource.");
        }
    }
}
