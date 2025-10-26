package com.donkie.quickcart.user.infra.service.usecase;

import com.donkie.quickcart.shared.exception.QuickcartBaseException;
import com.donkie.quickcart.user.application.model.UserProfileCommand;
import com.donkie.quickcart.user.domain.model.UserProfile;
import com.donkie.quickcart.user.domain.repository.UserProfileRepo;
import com.donkie.quickcart.user.infra.integration.keycloak.KeycloakClient;
import com.donkie.quickcart.user.infra.integration.keycloak.model.KeycloakUserData;
import com.donkie.quickcart.user.infra.integration.keycloak.model.UserRegistrationRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

import static com.donkie.quickcart.shared.exception.handler.SafeExecutor.safeExecute;
import static com.donkie.quickcart.shared.integration.helper.ClientResponseStatusResolver.resolveStatus;

@Service
@AllArgsConstructor
@Slf4j
public class RegisterUserUseCase {

    private final KeycloakClient keycloakClient;
    private final UserProfileRepo userProfileRepo;

    /**
     * Creates a new user in KeycloakRequestHandler and assigns the customer role.
     *
     * @param register the registration command containing user details
     * @return KeycloakUserData containing user details
     */
    public KeycloakUserData createNewUser(UserProfileCommand.Register register) {
        log.info("Starting user registration for email: {}", register.email());

        if (userProfileRepo.existsByEmail(register.email()))
            throw new RuntimeException("User Already exists by Email");

        // 1. Register user in KeycloakRequestHandler
        safeExecute(
                () -> keycloakClient.registerNewUser(UserRegistrationRequest.create(register.email(), register.password())),
                (e) -> new QuickcartBaseException(
                        resolveStatus(e),
                        "Failed to load user details from Authentication service",
                        e)
        );
        log.debug("User registered in KeycloakRequestHandler: {}", register.email());

        // 2. Find User Details
        KeycloakUserData userData = safeExecute(
                () -> keycloakClient.getUserDetails(register.email()),
                (e) -> new QuickcartBaseException(
                        resolveStatus(e),
                        "Failed to load user details from Authentication service",
                        e)
        );
        log.debug("Retrieved user data from KeycloakRequestHandler: {}", userData.userId());

        // 4. Create User Profile
        UserProfile profile = UserProfile.builder()
                .userId(UUID.fromString(userData.userId()))
                .email(userData.email())
                .build();

        // 5. Save User Profile
        userProfileRepo.save(profile);
        return userData;
    }
}
