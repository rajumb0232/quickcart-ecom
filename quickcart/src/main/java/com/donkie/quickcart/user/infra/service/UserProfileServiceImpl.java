package com.donkie.quickcart.user.infra.service;

import com.donkie.quickcart.user.application.model.SellerProfileCommand;
import com.donkie.quickcart.user.application.model.UserProfileCommand;
import com.donkie.quickcart.user.application.model.UserProfileResult;
import com.donkie.quickcart.user.application.service.UserProfileService;
import com.donkie.quickcart.user.domain.model.SellerProfile;
import com.donkie.quickcart.user.domain.model.UserProfile;
import com.donkie.quickcart.user.domain.model.UserRole;
import com.donkie.quickcart.user.domain.repository.SellerProfileRepo;
import com.donkie.quickcart.user.domain.repository.UserProfileRepo;
import com.donkie.quickcart.user.infra.integration.keycloak.KeycloakClient;
import com.donkie.quickcart.user.infra.integration.keycloak.model.KeycloakUserData;
import com.donkie.quickcart.user.infra.service.usecase.AssignRoleUseCase;
import com.donkie.quickcart.user.infra.service.usecase.CreateSellerProfileUseCase;
import com.donkie.quickcart.user.infra.service.usecase.RegisterUserUseCase;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static com.donkie.quickcart.shared.security.util.CurrentUser.*;

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
    private final RegisterUserUseCase registerUserUseCase;
    private final AssignRoleUseCase assignRoleUseCase;
    private final CreateSellerProfileUseCase createSellerProfileUseCase;

    /**
     * Registers a new user in KeycloakRequestHandler and assigns the customer role.
     *
     * @param register the registration command containing user details
     * @throws RuntimeException if registration fails or customer role not found
     */
    @Transactional
    @Override
    public void registerNewUser(UserProfileCommand.Register register) {
        // Do not allow if the user is currently authenticated
        if (getCurrentUserId().isPresent()) {
            throw new AccessDeniedException("User already authenticated, cannot re-register");
        }

        KeycloakUserData userData = registerUserUseCase.createNewUser(register);
        assignRoleUseCase.assignRolesToUser(UUID.fromString(userData.userId()), List.of(UserRole.CUSTOMER));
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
        boolean updated = mapIfModified(update, existingProfile);

        if (!updated) {
            log.debug("No changes detected for user profile: {}", userId);
            return UserProfileResult.buildUserDetailResponse(existingProfile);
        }

        UserProfile updatedProfile = userProfileRepo.save(existingProfile);
        log.info("Successfully updated user profile for user: {}", updatedProfile.getUserId());

        return buildUserProfileDetailResponse(updatedProfile);
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

        return getCurrentUserId()
                .flatMap(userProfileRepo::findById)
                .map(this::buildUserProfileDetailResponse)
                .orElseThrow(() -> new RuntimeException("Failed to find user details."));
    }

    @Override
    @Transactional
    public UserProfileResult.Detail createSellerProfile() {
        // Throw if user already a seller
        if (doesUserHasRole(UserRole.SELLER))
            throw new RuntimeException("User is already a seller, cannot create seller profile");

        // Find user profile
        var userId = getCurrentUserId().orElseThrow(() -> new RuntimeException("Failed to find user ID"));

        // Create Seller Profile
        SellerProfile profile = createSellerProfileUseCase.execute(userId);

        // Update user role in keycloak
        assignRoleUseCase.assignRolesToUser(profile.getSellerId(), List.of(UserRole.SELLER));

        return buildUserProfileDetailResponse(profile.getUserProfile());
    }

    @Override
    public UserProfileResult.Detail updateSellerProfile(SellerProfileCommand.Update update) {
        // check if the user is seller
        if (!doesUserHasRole(UserRole.SELLER))
            throw new RuntimeException("User is not a seller, cannot update seller profile");

        return sellerProfileRepo.findById(getCurrentUserId().orElseThrow(() -> new RuntimeException("Failed to find user ID")))
                .map(seller -> {
                    if (update.bio() == null || update.bio().isEmpty()) {
                        log.debug("not changes detected for seller profile.");
                        return UserProfileResult.buildSellerDetailResponse(seller.getUserProfile(), seller);
                    }
                    log.debug("Detected changes for bio, requested: {}, existing: {}", update.bio(), seller.getBio());
                    seller.setBio(update.bio());
                    sellerProfileRepo.save(seller);

                    return buildUserProfileDetailResponse(seller.getUserProfile());
                }).orElseThrow(() -> new RuntimeException("Failed to update seller profile, seller profile not found."));
    }

    @Override
    public void registerAdmin(UserProfileCommand.Register register) {
        KeycloakUserData userData = registerUserUseCase.createNewUser(register);
        createSellerProfileUseCase.execute(UUID.fromString(userData.userId()));

        var roles = List.of(UserRole.ADMIN, UserRole.SELLER, UserRole.CUSTOMER);
        assignRoleUseCase.assignRolesToUser(
                UUID.fromString(userData.userId()),
                roles
        );
    }

    /* ----------- Helper Methods ----------- */

    /**
     * Maps the fields of the update request to the existing profile if they are not null.
     *
     * @param update          the update command
     * @param existingProfile the existing user profile
     * @return true if any field was modified, false otherwise.
     */
    private static boolean mapIfModified(UserProfileCommand.Update update, UserProfile existingProfile) {
        boolean updated = false;
        if (update.firstName() != null && !update.firstName().equals(existingProfile.getFirstName())) {
            log.debug("Detected difference in first name, requested: {}, existing: {}", update.firstName(), existingProfile.getFirstName());
            existingProfile.setFirstName(update.firstName());
            updated = true;
        }
        if (update.lastName() != null && !update.lastName().equals(existingProfile.getLastName())) {
            log.debug("Detected difference in last name, requested: {}, existing: {}", update.lastName(), existingProfile.getLastName());
            existingProfile.setLastName(update.lastName());
            updated = true;
        }
        if (update.phoneNumber() != null && !update.phoneNumber().equals(existingProfile.getPhoneNumber())) {
            log.debug("Detected difference in phone number, requested: {}, existing: {}", update.phoneNumber(), existingProfile.getPhoneNumber());
            existingProfile.setPhoneNumber(update.phoneNumber());
            updated = true;
        }
        return updated;
    }

    private UserProfileResult.Detail buildUserProfileDetailResponse(UserProfile userProfile) {

        // 1. If Admin, the profile includes all roles - customer, seller and admin.
        if (getCurrentUserRoles().contains(UserRole.ADMIN.getDisplayName())) {
            var sellerProfile = getSellerProfile(userProfile);
            return UserProfileResult.buildAdminDetailResponse(userProfile, sellerProfile);
        }

        // 2. If Seller, the profile includes roles such as - customer and seller.
        else if (getCurrentUserRoles().contains(UserRole.SELLER.getDisplayName())) {
            var sellerProfile = getSellerProfile(userProfile);
            return UserProfileResult.buildSellerDetailResponse(userProfile, sellerProfile);
        }

        // 3. Customer has just one role as 'customer' itself.
        else {
            return UserProfileResult.buildUserDetailResponse(userProfile);
        }
    }

    private SellerProfile getSellerProfile(UserProfile userProfile) {
        return sellerProfileRepo.findById(userProfile.getUserId())
                .orElseGet(() -> {
                    log.warn("User is seller, but no seller profile found.");
                    return null;
                });
    }
}
