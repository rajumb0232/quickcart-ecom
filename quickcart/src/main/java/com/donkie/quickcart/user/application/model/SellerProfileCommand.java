package com.donkie.quickcart.user.application.model;

import java.util.UUID;

public final class SellerProfileCommand {
    public record Create(
            UUID userId,
            String bio
    ){}

    public record Update(
            String bio
    ){}
}
