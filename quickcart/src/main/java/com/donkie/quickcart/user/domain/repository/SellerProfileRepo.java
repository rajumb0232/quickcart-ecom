package com.donkie.quickcart.user.domain.repository;

import com.donkie.quickcart.user.domain.model.SellerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SellerProfileRepo extends JpaRepository<SellerProfile, UUID> {

    Optional<SellerProfile> findByUserProfile_Email(String email);
}
