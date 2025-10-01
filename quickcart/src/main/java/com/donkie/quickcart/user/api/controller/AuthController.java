package com.donkie.quickcart.user.api.controller;

import com.donkie.quickcart.shared.dto.ApiResponse;
import com.donkie.quickcart.user.api.dto.request.AuthResponse;
import com.donkie.quickcart.user.api.dto.request.UserCredentials;
import com.donkie.quickcart.user.api.facade.AuthServiceFacade;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@AllArgsConstructor
public class AuthController {

    private final AuthServiceFacade authServiceFacade;

    @PostMapping("/public/login")
    public ResponseEntity<ApiResponse<AuthResponse>> loginUser(@Valid @RequestBody UserCredentials userCredentials) {
        AuthResponse response = authServiceFacade.loginUser(userCredentials);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ApiResponse.success(
                        "login successful",
                        response
                ));
    }

    @GetMapping("/users/roles")
    public ResponseEntity<ApiResponse<List<String>>> getUserRoles() {
        var userRoles = authServiceFacade.getUserRoles();
        return ResponseEntity
                .ok(ApiResponse.success(
                        "Roles Fetched",
                        userRoles
                ));
    }
}
