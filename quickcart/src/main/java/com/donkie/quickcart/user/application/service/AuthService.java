package com.donkie.quickcart.user.application.service;

import com.donkie.quickcart.user.application.model.LoginCommand;
import com.donkie.quickcart.user.application.model.LoginResult;

import java.util.List;

import static com.donkie.quickcart.shared.security.CurrentUser.getCurrentUserRoles;

public interface AuthService {

    public LoginResult.Detail loginUser(LoginCommand.Create create);

    public List<String> getUserRoles();

    LoginResult.Detail refreshLogin(String refreshToken);

    void logoutUser(String refreshToken, String accessToken);
}
