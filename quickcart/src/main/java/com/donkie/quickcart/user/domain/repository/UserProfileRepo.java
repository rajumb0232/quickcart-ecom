package com.donkie.quickcart.user.domain.repository;

import com.donkie.quickcart.user.domain.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserProfileRepo extends JpaRepository<UserProfile, UUID> {

    Optional<UserProfile> findByEmail(String email);

    boolean existsByEmail(String email);
}
