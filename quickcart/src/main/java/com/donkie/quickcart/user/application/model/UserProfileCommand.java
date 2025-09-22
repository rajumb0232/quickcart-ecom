package com.donkie.quickcart.user.application.model;

import java.time.LocalDate;

public final class UserProfileCommand {

    public record Register(
            String email,
            String password
    ) {
    }

    public record Create(
            String firstName,
            String lastName,
            String phoneNumber,
            LocalDate dateOfBirth
    ) {
    }

    public record Update(
            String firstName,
            String lastName,
            String phoneNumber
    ) {
    }
}
