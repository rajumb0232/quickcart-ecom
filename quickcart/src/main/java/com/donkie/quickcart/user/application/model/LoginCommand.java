package com.donkie.quickcart.user.application.model;

public class LoginCommand {
    public record Create(
            String email,
            String password
    ){}
}
