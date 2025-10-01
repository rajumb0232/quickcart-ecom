package com.donkie.quickcart.user.infra.service;

import com.donkie.quickcart.user.application.model.LoginCommand;
import com.donkie.quickcart.user.application.model.LoginResult;
import com.donkie.quickcart.user.infra.integration.keycloak.KeycloakAuthClient;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthService {

    private final KeycloakAuthClient keycloakAuthClient;

    public LoginResult.Detail loginUser(LoginCommand.Create create) {
        return keycloakAuthClient.loginUser(create);
    }
}
