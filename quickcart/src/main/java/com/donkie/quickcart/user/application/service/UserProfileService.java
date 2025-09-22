package com.donkie.quickcart.user.application.service;

import com.donkie.quickcart.user.application.model.UserProfileCommand;
import com.donkie.quickcart.user.application.model.UserProfileResult;
import com.donkie.quickcart.user.domain.model.UserProfile;
import com.donkie.quickcart.user.domain.repository.UserProfileRepo;
import com.donkie.quickcart.user.infra.integration.client.KeycloakClient;
import com.donkie.quickcart.user.infra.integration.model.KeycloakUserData;
import com.donkie.quickcart.user.infra.integration.model.UserRegistrationRequest;
import com.donkie.quickcart.user.infra.integration.model.UserRoleData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

import static com.donkie.quickcart.user.infra.security.util.CurrentUser.getCurrentUsername;

/**
 * Service for managing user profiles and registration.
 * Handles integration between Keycloak and local user profile storage.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserProfileService {

    private final UserProfileRepo userProfileRepo;
    private final KeycloakClient keycloakClient;

    private static final String CUSTOMER_ROLE = "customer";
    private static final int MAX_RETRY_ATTEMPTS = 3;
    private static final long RETRY_DELAY_MS = 1000;

    /**
     * Registers a new user in Keycloak and assigns the customer role.
     *
     * @param register the registration command containing user details
     * @throws RuntimeException if registration fails or customer role not found
     */
    @Transactional
    public void registerNewUser(UserProfileCommand.Register register) {
        log.info("Starting user registration for email: {}", register.email());

        try {
            // 1. Register user in Keycloak
            keycloakClient.registerNewUser(UserRegistrationRequest.create(register.email(), register.password()));
            log.debug("User registered in Keycloak: {}", register.email());

            // 2. Retrieve user data with retry logic (Keycloak might need time to propagate)
            KeycloakUserData userData = retryGetUserDetails(register.email());
            log.debug("Retrieved user data from Keycloak: {}", userData.userId());

            // 3. Find customer role
            UserRoleData customerRole = findCustomerRole();

            // 4. Assign customer role to user
            keycloakClient.mapRoleToKeyCloakUser(customerRole, UUID.fromString(userData.userId()));
            log.info("Successfully registered user and assigned customer role: {}", register.email());

        } catch (Exception e) {
            log.error("Failed to register user: {}", register.email(), e);
            throw new RuntimeException("User registration failed for: " + register.email(), e);
        }
    }

    /**
     * Creates a user profile for the currently authenticated user.
     *
     * @param create the profile creation command
     * @return the created user profile details
     * @throws RuntimeException if user not authenticated or profile already exists
     */
    @Transactional
    public UserProfileResult.Detail createUserProfile(UserProfileCommand.Create create) {
        log.info("Creating user profile for authenticated user");

        String currentUsername = getCurrentUsername()
                .orElseThrow(() -> new RuntimeException("User credentials not found"));

        log.debug("Creating profile for user: {}", currentUsername);

        UserProfile userProfile = UserProfile.builder()
                .firstName(create.firstName())
                .lastName(create.lastName())
                .dateOfBirth(create.dateOfBirth())
                .phoneNumber(create.phoneNumber())
                .email(currentUsername)  // Use email from security context
                .userId(null) // Or generate UUID here if needed
                .build();

        UserProfile savedProfile = userProfileRepo.save(userProfile);
        log.info("Successfully created user profile for user: {}", currentUsername);

        return mapToUserProfileResultDetail(savedProfile);
    }

    /**
     * Updates the user profile for the currently authenticated user.
     *
     * @param update the profile update command
     * @return the updated user profile details
     * @throws RuntimeException if user not authenticated or profile not found
     */
    @Transactional
    public UserProfileResult.Detail updateUserProfile(UserProfileCommand.Update update) {
        log.info("Updating user profile for authenticated user");

        // 1. Get current user from security context
        KeycloakUserData keycloakUserData = getCurrentUsername()
                .map(keycloakClient::getUserDetails)
                .orElseThrow(() -> new RuntimeException("User credentials not found"));

        UUID userId = UUID.fromString(keycloakUserData.userId());
        log.debug("Updating profile for user ID: {}", userId);

        String currentUsername = getCurrentUsername()
                .orElseThrow(() -> new RuntimeException("User credentials not found"));

        // 2. Find existing profile by email
        UserProfile existingProfile = userProfileRepo.findByEmail(currentUsername)
                .orElseThrow(() -> new RuntimeException("User profile not found for user: " + currentUsername));

        // 3. Update fields (only non-null values)
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
            return mapToUserProfileResultDetail(existingProfile);
        }

        UserProfile updatedProfile = userProfileRepo.save(existingProfile);
        log.info("Successfully updated user profile for user: {}", userId);

        return mapToUserProfileResultDetail(updatedProfile);
    }

    /**
     * Retrieves the user profile for the currently authenticated user.
     *
     * @return the user profile details or null if not found
     */
    @Transactional(readOnly = true)
    public UserProfileResult.Detail getCurrentUserProfile() {
        log.debug("Retrieving current user profile");

        return getCurrentUsername()
                .flatMap(userProfileRepo::findByEmail)
                .map(this::mapToUserProfileResultDetail)
                .orElseThrow(() -> new RuntimeException("Failed to find user details."));
    }


    /* ----------- Helper Methods ----------- */

    /**
     * Retries getting user details from Keycloak with exponential backoff.
     * Keycloak might need time to propagate user creation.
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
    private UserRoleData findCustomerRole() {
        return keycloakClient.getAllUserRoles().stream()
                .filter(role -> CUSTOMER_ROLE.equalsIgnoreCase(role.roleName()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Customer role not found in Keycloak"));
    }

    /**
     * Maps UserProfile entity to UserProfileResult.Detail.
     */
    private UserProfileResult.Detail mapToUserProfileResultDetail(UserProfile userProfile) {
        return new UserProfileResult.Detail(
                userProfile.getUserId(),
                userProfile.getFirstName(),
                userProfile.getLastName(),
                userProfile.getEmail(),
                userProfile.getDateOfBirth(),
                userProfile.getCreateDate(),
                userProfile.getLastModifiedDate()
        );
    }
}
