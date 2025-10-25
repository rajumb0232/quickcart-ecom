package com.donkie.quickcart.user.domain.repository;

import com.donkie.quickcart.user.domain.model.RevokedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

public interface RevokedTokenRepo extends JpaRepository<RevokedToken, String> {

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO revoked_token (jti, expiration) VALUES (:jti, :exp)", nativeQuery = true)
    int insert(@Param("jti") String jti,
               @Param("exp")Instant exp);

    List<RevokedToken> findByExpirationBefore(Instant before);
}
