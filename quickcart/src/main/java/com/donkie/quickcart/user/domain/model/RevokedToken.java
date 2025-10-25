package com.donkie.quickcart.user.domain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "revoked_token", indexes = {
        @Index(name = "idx_jti", columnList = "jti"),
        @Index(name = "idx_exp", columnList = "expiration")
})
@Getter
@Setter
public class RevokedToken {
    @Id
    @Column(name = "jti", nullable = false)
    private String jti;

    @Column(name = "expiration", nullable = false, updatable = false)
    private Instant expiration;
}
