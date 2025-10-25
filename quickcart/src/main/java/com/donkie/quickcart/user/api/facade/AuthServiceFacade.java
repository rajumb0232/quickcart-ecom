package com.donkie.quickcart.user.api.facade;

import com.donkie.quickcart.user.api.dto.request.AuthResponse;
import com.donkie.quickcart.user.api.dto.request.UserCredentials;
import com.donkie.quickcart.user.application.model.LoginCommand;
import com.donkie.quickcart.user.application.model.LoginResult;
import com.donkie.quickcart.user.application.service.AuthService;
import com.donkie.quickcart.user.infra.service.AuthServiceImpl;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@AllArgsConstructor
public class AuthServiceFacade {

    private final AuthService authService;

    public AuthResponse loginUser(@Valid UserCredentials userCredentials) {
        LoginResult.Detail result = authService.loginUser(new LoginCommand.Create(userCredentials.email(), userCredentials.password()));
        return toAuthResponse(result);
    }

    public List<String> getUserRoles() {
        return authService.getUserRoles();
    }

    public AuthResponse refreshLogin(String refreshToken) {
        LoginResult.Detail result = authService.refreshLogin(refreshToken);
        return toAuthResponse(result);
    }

    private static AuthResponse toAuthResponse(LoginResult.Detail result) {
        return new AuthResponse(
                result.accessToken(),
                result.accessExpiresIn(),
                result.refreshToken(),
                result.refreshExpiresIn(),
                result.tokenType());
    }
}
