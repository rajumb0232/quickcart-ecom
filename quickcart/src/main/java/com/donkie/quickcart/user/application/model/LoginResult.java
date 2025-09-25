package com.donkie.quickcart.user.application.model;

public class LoginResult {
    public record Detail(
            String accessToken,
            int accessExpiresIn,
            String refreshToken,
            int refreshExpiresIn,
            String tokenType
    ) {}
}
