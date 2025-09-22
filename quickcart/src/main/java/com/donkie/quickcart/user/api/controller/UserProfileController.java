package com.donkie.quickcart.user.api.controller;

import com.donkie.quickcart.user.api.dto.request.CreateUserProfileRequest;
import com.donkie.quickcart.user.api.dto.request.UpdateUserProfileRequest;
import com.donkie.quickcart.user.api.dto.request.UserRegistrationRequest;
import com.donkie.quickcart.user.api.dto.response.ApiResponse;
import com.donkie.quickcart.user.api.dto.response.UserProfileResponse;
import com.donkie.quickcart.user.api.facade.UserProfileServiceFacade;
import com.donkie.quickcart.user.api.mapper.UserProfileApiMapper;
import com.donkie.quickcart.user.application.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for user profile management.
 * Handles user registration, profile creation, updates, and retrieval.
 */
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final UserProfileApiMapper mapper;
    private final UserProfileServiceFacade userProfileServiceFacade;

    /**
     * Registers a new user in the system.
     * Public endpoint - no authentication required.
     */
    @PostMapping("/public/users/register")
    public ResponseEntity<ApiResponse<Void>> registerUser(@Valid @RequestBody UserRegistrationRequest request) {
        log.info("User registration request received for email: {}", request.email());
        userProfileServiceFacade.registerNewUser(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully"));
    }

    /**
     * Creates a user profile for the authenticated user.
     * Requires authentication.
     */
    @PostMapping("/users/profile")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<UserProfileResponse>> createProfile(@Valid @RequestBody CreateUserProfileRequest request) {
        log.info("Create profile request received");
        UserProfileResponse response = userProfileServiceFacade.createProfile(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Profile created successfully", response));
    }

    /**
     * Updates the user profile for the authenticated user.
     * Requires authentication.
     */
    @PutMapping("/users/profile")
    @PreAuthorize("hasRole('CUSTOMER')")
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
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getCurrentProfile() {
        log.debug("Get current profile request received");

        UserProfileResponse response = userProfileServiceFacade.getUserProfile();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * Health check endpoint for the user service.
     */
    @GetMapping("/public/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("User service is healthy");
    }
}