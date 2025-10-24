package com.donkie.quickcart.user.infra.config;

import com.donkie.quickcart.shared.config.ApplicationProperties;
import com.donkie.quickcart.user.application.model.UserProfileCommand;
import com.donkie.quickcart.user.domain.model.UserRole;
import com.donkie.quickcart.user.infra.integration.keycloak.KeycloakClient;
import com.donkie.quickcart.user.infra.integration.keycloak.model.KeycloakUserData;
import com.donkie.quickcart.user.infra.service.usecase.AssignRoleUseCase;
import com.donkie.quickcart.user.infra.service.usecase.CreateSellerProfileUseCase;
import com.donkie.quickcart.user.infra.service.usecase.RegisterUserUseCase;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Component
@AllArgsConstructor
@Slf4j
public class DefaultAdminConfig {
    private final RegisterUserUseCase registerUserUseCase;
    private final AssignRoleUseCase assignRoleUseCase;
    private final ApplicationProperties props;
    private final KeycloakClient keycloakClient;
    private final CreateSellerProfileUseCase createSellerProfileUseCase;

    @Transactional
    @EventListener(ApplicationReadyEvent.class)
    public void registerDefaultAdmin() {
        if (keycloakClient.hasAtLeastOneRealUserWithRole(UserRole.ADMIN)) {
            log.info("Admin Exists. Not attempting default admin registration.");
            return;
        }

        var registerCmd = new UserProfileCommand.Register(
                Objects.requireNonNull(props.getAdmin().getUsername(), "Admin username is required."),
                Objects.requireNonNull(props.getAdmin().getPassword(), "Admin password is required.")
        );

        log.info("Attempting to Register Default Admin");
        KeycloakUserData userData = registerUserUseCase.createNewUser(registerCmd);
        log.info("Profile Registered.");
        createSellerProfileUseCase.execute(UUID.fromString(userData.userId()));
        log.info("Seller Profile Created");

        var roles = List.of(UserRole.ADMIN, UserRole.SELLER, UserRole.CUSTOMER);
        assignRoleUseCase.assignRolesToUser(
                UUID.fromString(userData.userId()),
                roles
        );
        log.info("Assigned Roles {}", roles);
        log.info("Default admin registered successfully.");
    }
}
