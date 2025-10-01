package com.donkie.quickcart.user.infra.service;

import com.donkie.quickcart.user.application.model.LoginCommand;
import com.donkie.quickcart.user.application.model.LoginResult;
import com.donkie.quickcart.user.infra.integration.keycloak.KeycloakAuthClient;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.donkie.quickcart.shared.security.CurrentUser.*;

@Service
@AllArgsConstructor
public class AuthService {

    private final KeycloakAuthClient keycloakAuthClient;

    public LoginResult.Detail loginUser(LoginCommand.Create create) {
        return keycloakAuthClient.loginUser(create);
    }

    public List<String> getUserRoles() {
        return getCurrentUserRoles();
    }
}
