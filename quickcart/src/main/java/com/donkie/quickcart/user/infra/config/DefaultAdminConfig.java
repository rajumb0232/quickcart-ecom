package com.donkie.quickcart.user.infra.config;

import com.donkie.quickcart.shared.config.ApplicationProperties;
import com.donkie.quickcart.user.application.model.UserProfileCommand;
import com.donkie.quickcart.user.domain.model.UserRole;
import com.donkie.quickcart.user.infra.integration.keycloak.KeycloakClient;
import com.donkie.quickcart.user.infra.integration.keycloak.model.KeycloakUserData;
import com.donkie.quickcart.user.infra.service.usecase.AssignRoleUseCase;
import com.donkie.quickcart.user.infra.service.usecase.RegisterUserUseCase;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

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

    @PostConstruct
    public void registerDefaultAdmin() {
        if (keycloakClient.hasAtLeastOneRealUserWithRole(UserRole.ADMIN)) {
            log.info("QuickCart Admin Exists. Not attempting default admin registration.");
            return;
        }

        var registerCmd = new UserProfileCommand.Register(
                Objects.requireNonNull(props.getAdmin().getUsername(), "Admin username is required."),
                Objects.requireNonNull(props.getAdmin().getPassword(), "Admin password is required.")
        );

        KeycloakUserData userData = registerUserUseCase.createNewUser(registerCmd);

        assignRoleUseCase.assignRolesToUser(
                UUID.fromString(userData.userId()),
                List.of(UserRole.ADMIN)
        );

        log.info("Default admin registered successfully.");
    }
}
