package com.donkie.quickcart.user.api.controller;

import com.donkie.quickcart.shared.dto.ApiAck;
import com.donkie.quickcart.shared.dto.ApiResponse;
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
     * Health check endpoint for the user service.
     */
    @GetMapping("/public/health")
    public ResponseEntity<ApiAck> health() {
        return ResponseEntity.ok(ApiAck.success("User service is healthy"));
    }
}