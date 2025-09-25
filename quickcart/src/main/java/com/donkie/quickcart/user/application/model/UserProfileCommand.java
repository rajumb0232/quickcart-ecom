package com.donkie.quickcart.user.application.model;


public final class UserProfileCommand {

    public record Register(
            String email,
            String password
    ) {
    }

    public record Update(
            String firstName,
            String lastName,
            String phoneNumber
    ) {
    }
}
