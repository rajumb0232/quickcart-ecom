package com.donkie.quickcart.user.infra.service.usecase;

import com.donkie.quickcart.user.domain.model.SellerProfile;
import com.donkie.quickcart.user.domain.repository.SellerProfileRepo;
import com.donkie.quickcart.user.domain.repository.UserProfileRepo;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@AllArgsConstructor
@Slf4j
public class CreateSellerProfileUseCase {

    private final UserProfileRepo userProfileRepo;
    private final SellerProfileRepo sellerProfileRepo;

    public SellerProfile execute(UUID userId) {
        var user = userProfileRepo.findById(userId).orElseThrow(() -> new RuntimeException("Failed to find user"));

        return sellerProfileRepo.findById(userId)
                .orElseGet(() -> {
                    log.info("Seller Profile not previously present, creating new one.");
                    // Create seller profile
                    SellerProfile profile = SellerProfile.builder()
                            .sellerId(userId)
                            .sellingSince(Instant.now())
                            .userProfile(user)
                            .build();

                    log.info("Saving SellerProfile");
                    // Save seller profile
                    int res = sellerProfileRepo.insert(userId, null);
                    if(res > 0)
                        return sellerProfileRepo.findById(userId)
                                .orElseThrow();
                    else throw new RuntimeException("Failed to create seller profile");
                });

    }
}
