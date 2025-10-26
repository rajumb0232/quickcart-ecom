package com.donkie.quickcart.user.infra.service;

import com.donkie.quickcart.shared.security.jwt.JwtExtractor;
import com.donkie.quickcart.user.application.exception.UserLoginFailedException;
import com.donkie.quickcart.user.application.model.LoginCommand;
import com.donkie.quickcart.user.application.model.LoginResult;
import com.donkie.quickcart.user.application.service.AuthService;
import com.donkie.quickcart.user.infra.exception.UserLoginRefreshFailedException;
import com.donkie.quickcart.user.infra.integration.keycloak.KeycloakAuthClient;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

import static com.donkie.quickcart.shared.exception.handler.SafeExecutor.safeExecute;
import static com.donkie.quickcart.shared.integration.helper.ClientResponseStatusResolver.resolveBaseExceptionStatus;
import static com.donkie.quickcart.shared.security.util.CurrentUser.getCurrentUserRoles;

@Slf4j
@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final KeycloakAuthClient keycloakAuthClient;
    private final JwtExtractor jwtExtractor;
    private final TokenRevocationService tokenRevocationService;

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

    @Override
    public LoginResult.Detail refreshLogin(String refreshToken) {
        return safeExecute(
                () -> keycloakAuthClient.refreshToken(refreshToken),
                (e) -> new UserLoginRefreshFailedException(
                        resolveBaseExceptionStatus(e),
                        e.getMessage(),
                        e)
        );
    }

    @Override
    public void logoutUser(String refreshToken, String accessToken) {
        safeExecute(
                () -> {
                    keycloakAuthClient.logoutUser(refreshToken);
                    if(accessToken != null) {
                        String jti = jwtExtractor.extractJti(accessToken);
                        Instant exp = jwtExtractor.extractExpiration(accessToken);
                       tokenRevocationService.blacklistToken(jti, exp);
                    }
                },
                (e) -> new UserLoginRefreshFailedException(
                        resolveBaseExceptionStatus(e),
                        e.getMessage(),
                        e)
        );
    }
}
