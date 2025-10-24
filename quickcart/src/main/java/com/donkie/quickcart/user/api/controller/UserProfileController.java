package com.donkie.quickcart.user.api.controller;

import com.donkie.quickcart.shared.dto.ApiAck;
import com.donkie.quickcart.shared.dto.ApiResponse;
import com.donkie.quickcart.user.api.dto.request.CreateUserProfileRequest;
import com.donkie.quickcart.user.api.dto.request.SellerEditRequest;
import com.donkie.quickcart.user.api.dto.request.UpdateUserProfileRequest;
import com.donkie.quickcart.user.api.dto.request.UserCredentials;
import com.donkie.quickcart.user.api.dto.response.UserProfileResponse;
import com.donkie.quickcart.user.api.facade.UserProfileServiceFacade;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

/**
 * REST controller for user profile management.
 * Handles user registration, profile creation, updates, and retrieval.
 */
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class UserProfileController {

    private final UserProfileServiceFacade userProfileServiceFacade;

    /**
     * Health check endpoint for the user service.
     */
    @GetMapping("/public/health")
    public ResponseEntity<ApiAck> health() {
        return ResponseEntity.ok(ApiAck.success("User service is healthy"));
    }

    /**
     * Registers a new user in the system.
     * Public endpoint - no authentication required.
     */
    @PostMapping("/public/users/register")
    public ResponseEntity<ApiAck> registerUser(@Valid @RequestBody UserCredentials request) {
        log.info("User registration request received for email: {}", request.email());
        userProfileServiceFacade.registerNewUser(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .location(URI.create("/api/v1/users/profile"))
                .body(ApiAck.success("User registered successfully"));
    }

    /**
     * Updates the user profile for the authenticated user.
     * Requires authentication.
     */
    @PutMapping("/users/profile")
    @PreAuthorize("hasAuthority('customer')")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(@Valid @RequestBody UpdateUserProfileRequest request) {
        log.info("Update profile request received");
        UserProfileResponse response = userProfileServiceFacade.updateProfile(request);

        return ResponseEntity
                .ok(ApiResponse.success("Profile updated successfully", response));
    }

    /**
     * Retrieves the current user's profile.
     * Requires authentication.
     */
    @GetMapping("/users/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getCurrentProfile() {
        log.debug("Get current profile request received");

        UserProfileResponse response = userProfileServiceFacade.getUserProfile();
        return ResponseEntity.ok(ApiResponse.success(
                "Profile fetched successfully",
                response
        ));
    }

    /**
     * Creates a seller profile for the authenticated user.
     * Requires authentication.
     *
     * @return response indicating success or failure
     */
    @PostMapping("/sellers/profile")
    @PreAuthorize("hasAuthority('customer')")
    public ResponseEntity<ApiResponse<UserProfileResponse>> createSellerProfile() {
        log.info("Creating seller profile");

        UserProfileResponse response = userProfileServiceFacade.createSellerProfile();
        return ResponseEntity.status(HttpStatus.CREATED)
                .location(URI.create("/api/v1/users/profile"))
                .body(ApiResponse.success(
                        "Seller Profile Created Successfully",
                        response
                ));
    }

    /**
     * Updates the seller profile for the authenticated user.
     * Requires authentication.
     *
     * @param request request containing the seller's bio
     * @return response indicating success or failure
     */
    @PutMapping("/sellers/profile")
    @PreAuthorize("hasAuthority('seller')")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateSellerProfile(@RequestBody @Valid SellerEditRequest request) {
        log.info("Updating seller profile");

        UserProfileResponse response = userProfileServiceFacade.updateSellerProfile(request);
        return ResponseEntity
                .ok(ApiResponse.success(
                        "Seller Profile Updated Successfully",
                        response
                ));
    }

    @PostMapping("/admins/register")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<ApiAck> registerAdmin(@Valid @RequestBody UserCredentials credentials) {
        log.info("Creating new Admin");

        userProfileServiceFacade.registerAdmin(credentials);
        return ResponseEntity
                .created(URI.create("/api/v1/users/profile"))
                .body(ApiAck.success("Admin created successfully"));
    }
}