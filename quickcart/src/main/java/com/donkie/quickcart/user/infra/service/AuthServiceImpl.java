package com.donkie.quickcart.user.infra.service;

import com.donkie.quickcart.user.application.exception.UserLoginFailedException;
import com.donkie.quickcart.user.application.model.LoginCommand;
import com.donkie.quickcart.user.application.model.LoginResult;
import com.donkie.quickcart.user.application.service.AuthService;
import com.donkie.quickcart.user.infra.integration.keycloak.KeycloakAuthClient;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.donkie.quickcart.shared.exception.handler.SafeExecutor.safeExecute;
import static com.donkie.quickcart.shared.integration.helper.ClientResponseStatusResolver.resolveBaseExceptionStatus;
import static com.donkie.quickcart.shared.security.CurrentUser.getCurrentUserRoles;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final KeycloakAuthClient keycloakAuthClient;

    public LoginResult.Detail loginUser(LoginCommand.Create create) {
        return safeExecute(
                () -> keycloakAuthClient.loginUser(create),
                (e) ->  new UserLoginFailedException(
                        resolveBaseExceptionStatus(e),
                        "Failed to login user.",
                        e)
        );
    }

    public List<String> getUserRoles() {
        return getCurrentUserRoles();
    }
}
