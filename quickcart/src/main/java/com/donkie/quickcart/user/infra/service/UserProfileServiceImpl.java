package com.donkie.quickcart.user.infra.service;

import com.donkie.quickcart.user.application.model.SellerProfileCommand;
import com.donkie.quickcart.user.application.model.UserProfileCommand;
import com.donkie.quickcart.user.application.model.UserProfileResult;
import com.donkie.quickcart.user.application.service.UserProfileService;
import com.donkie.quickcart.user.domain.model.SellerProfile;
import com.donkie.quickcart.user.domain.model.UserProfile;
import com.donkie.quickcart.user.domain.repository.SellerProfileRepo;
import com.donkie.quickcart.user.domain.repository.UserProfileRepo;
import com.donkie.quickcart.user.infra.integration.keycloak.KeycloakClient;
import com.donkie.quickcart.user.infra.integration.keycloak.model.KeycloakUserData;
import com.donkie.quickcart.user.infra.integration.keycloak.model.UserRegistrationRequest;
import com.donkie.quickcart.user.infra.integration.keycloak.model.UserRoleData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

import static com.donkie.quickcart.shared.security.CurrentUser.*;

/**
 * Service for managing user profiles and registration.
 * Handles integration between KeycloakRequestHandler and local user profile storage.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserProfileServiceImpl implements UserProfileService {

    private final UserProfileRepo userProfileRepo;
    private final KeycloakClient keycloakClient;
    private final SellerProfileRepo sellerProfileRepo;

    private static final String CUSTOMER_ROLE = "customer";
    private static final String SELLER_ROLE = "seller";
    private static final String ADMIN_ROLE = "admin";
    private static final int MAX_RETRY_ATTEMPTS = 3;
    private static final long RETRY_DELAY_MS = 1000;

    /**
     * Registers a new user in KeycloakRequestHandler and assigns the customer role.
     *
     * @param register the registration command containing user details
     * @throws RuntimeException if registration fails or customer role not found
     */
    @Transactional
    @Override
    public void registerNewUser(UserProfileCommand.Register register) {
        log.info("Starting user registration for email: {}", register.email());

        if (getAuthentication().isPresent())
            throw new AccessDeniedException("User already authenticated, cannot re-register");

        if (userProfileRepo.existsByEmail(register.email()))
            throw new RuntimeException("User Already exists by Email");

        try {
            // 1. Register user in KeycloakRequestHandler
            keycloakClient.registerNewUser(UserRegistrationRequest.create(register.email(), register.password()));
            log.debug("User registered in KeycloakRequestHandler: {}", register.email());

            // 2. Retrieve user data with retry logic (KeycloakRequestHandler might need time to propagate)
            KeycloakUserData userData = retryGetUserDetails(register.email());
            log.debug("Retrieved user data from KeycloakRequestHandler: {}", userData.userId());

            // 3. Find customer role
            UserRoleData customerRole = findUserRole(CUSTOMER_ROLE);

            // 4. Assign customer role to user
            keycloakClient.mapRoleToKeyCloakUser(customerRole, UUID.fromString(userData.userId()));
            log.info("Successfully registered user and assigned customer role: {}", register.email());

            // 5. Create User Profile
            UserProfile profile = UserProfile.builder()
                    .userId(UUID.fromString(userData.userId()))
                    .email(userData.email())
                    .build();

            // 6. Save UserProfile
            userProfileRepo.save(profile);
        } catch (Exception e) {
            log.error("Failed to register user: {}", register.email(), e);
            throw new RuntimeException("User registration failed for: " + register.email(), e);
        }
    }

    /**
     * Updates the user profile for the currently authenticated user.
     *
     * @param update the profile update command
     * @return the updated user profile details
     * @throws RuntimeException if user not authenticated or profile not found
     */
    @Transactional
    @Override
    public UserProfileResult.Detail updateUserProfile(UserProfileCommand.Update update) {
        log.info("Updating user profile for authenticated user");

        UUID userId = getCurrentUserId()
                .orElseThrow(() -> new RuntimeException("User credentials not found"));

        // 1. Find existing profile by email
        UserProfile existingProfile = userProfileRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User profile not found for user: " + userId));

        log.debug("Updating profile for user ID: {}", userId);

        // 2. Update fields (only non-null values)
        boolean updated = false;
        if (update.firstName() != null && !update.firstName().equals(existingProfile.getFirstName())) {
            existingProfile.setFirstName(update.firstName());
            updated = true;
        }
        if (update.lastName() != null && !update.lastName().equals(existingProfile.getLastName())) {
            existingProfile.setLastName(update.lastName());
            updated = true;
        }
        if (update.phoneNumber() != null && !update.phoneNumber().equals(existingProfile.getPhoneNumber())) {
            existingProfile.setPhoneNumber(update.phoneNumber());
            updated = true;
        }

        if (!updated) {
            log.debug("No changes detected for user profile: {}", userId);
            return UserProfileResult.buildDetailResponse(existingProfile);
        }

        UserProfile updatedProfile = userProfileRepo.save(existingProfile);
        log.info("Successfully updated user profile for user: {}", userId);

        return UserProfileResult.buildDetailResponse(updatedProfile);
    }

    /**
     * Retrieves the user profile for the currently authenticated user.
     *
     * @return the user profile details or null if not found
     */
    @Transactional(readOnly = true)
    @Override
    public UserProfileResult.Detail getCurrentUserProfile() {
        log.debug("Retrieving current user profile");

        if (doesUserHasRole(SELLER_ROLE)) {
            return getCurrentUserId()
                    .flatMap(sellerProfileRepo::findById)
                    .map(UserProfileResult::buildDetailResponse)
                    .orElseThrow(() -> new RuntimeException("Failed to find seller details."));
        } else {
            return getCurrentUserId()
                    .flatMap(userProfileRepo::findById)
                    .map(UserProfileResult::buildDetailResponse)
                    .orElseThrow(() -> new RuntimeException("Failed to find user details."));
        }
    }

    @Override
    @Transactional
    public UserProfileResult.Detail createSellerProfile() {
        // Throw if user already a seller
        if (doesUserHasRole(SELLER_ROLE))
            throw new RuntimeException("User is already a seller, cannot create seller profile");

        // Find user profile
        var userId = getCurrentUserId().orElseThrow(() -> new RuntimeException("Failed to find user ID"));
        var user = userProfileRepo.findById(userId).orElseThrow(() -> new RuntimeException("Failed to find user"));

        // Create seller profile
        SellerProfile profile = SellerProfile.builder()
                .sellerId(userId)
                .sellingSince(Instant.now())
                .userProfile(user)
                .build();

        // Update user role in keycloak
        var roleData = this.findUserRole(SELLER_ROLE);
        keycloakClient.mapRoleToKeyCloakUser(roleData, userId);

        // Save seller profile
        sellerProfileRepo.save(profile);
        return UserProfileResult.buildDetailResponse(profile);
    }

    @Override
    public UserProfileResult.Detail updateSellerProfile(SellerProfileCommand.Update update) {
        // check if the user is seller
        if (!doesUserHasRole(SELLER_ROLE))
            throw new RuntimeException("User is not a seller, cannot update seller profile");

        return sellerProfileRepo.findById(getCurrentUserId().orElseThrow(() -> new RuntimeException("Failed to find user ID")))
                .map(seller -> {
                    if (update.bio() == null || update.bio().isEmpty()) {
                        log.info("not changes detected for seller profile.");
                        return UserProfileResult.buildDetailResponse(seller);
                    }
                    seller.setBio(update.bio());
                    sellerProfileRepo.save(seller);

                    return UserProfileResult.buildDetailResponse(seller);
                }).orElseThrow(() -> new RuntimeException("Failed to update seller profile, seller profile not found."));
    }

    /* ----------- Helper Methods ----------- */

    /**
     * Retries getting user details from KeycloakRequestHandler with exponential backoff.
     * KeycloakRequestHandler might need time to propagate user creation.
     */
    private KeycloakUserData retryGetUserDetails(String email) {
        for (int attempt = 1; attempt <= MAX_RETRY_ATTEMPTS; attempt++) {
            try {
                if (attempt > 1) {
                    Thread.sleep(RETRY_DELAY_MS * attempt); // Exponential backoff
                }

                KeycloakUserData userData = keycloakClient.getUserDetails(email);
                if (userData != null) {
                    log.debug("Successfully retrieved user data on attempt {}: {}", attempt, email);
                    return userData;
                }

                log.debug("User data not found on attempt {}: {}", attempt, email);

            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Interrupted while waiting for user creation", e);
            } catch (Exception e) {
                log.warn("Failed to retrieve user data on attempt {}: {}", attempt, email, e);
                if (attempt == MAX_RETRY_ATTEMPTS) {
                    throw e;
                }
            }
        }

        throw new RuntimeException("User not found after " + MAX_RETRY_ATTEMPTS + " attempts: " + email);
    }

    /**
     * Finds the customer role from available roles.
     */
    private UserRoleData findUserRole(String role) {
        return keycloakClient.getAllUserRoles().stream()
                .filter(r -> role.equalsIgnoreCase(r.roleName()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Customer role not found in KeycloakRequestHandler"));
    }
}
