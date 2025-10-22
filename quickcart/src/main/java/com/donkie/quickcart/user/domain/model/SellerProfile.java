package com.donkie.quickcart.user.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "seller_profile")
@EntityListeners(AuditingEntityListener.class)
public class SellerProfile {
    @Id
    @Column(name = "seller_id")
    private UUID sellerId;

    @Column(name = "bio", length = 2000)
    private String bio;

    @CreatedDate
    @Column(name = "selling_since")
    private Instant sellingSince;

    @OneToOne(optional = false)
    @JoinColumn(name = "seller_id", referencedColumnName = "user_id")
    @MapsId
    private UserProfile userProfile;
}
