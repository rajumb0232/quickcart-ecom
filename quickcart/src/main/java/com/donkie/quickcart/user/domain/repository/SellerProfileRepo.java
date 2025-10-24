package com.donkie.quickcart.user.domain.repository;

import com.donkie.quickcart.user.domain.model.SellerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

public interface SellerProfileRepo extends JpaRepository<SellerProfile, UUID> {

    // bypassing the internal save method, as autogeneration of seller is not done.
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO seller_profile (seller_id, bio) VALUES (:sellerId, :bio)", nativeQuery = true)
    int insert(@Param("sellerId") UUID sellerId,
                            @Param("bio") String bio);

    Optional<SellerProfile> findByUserProfile_Email(String email);
}
