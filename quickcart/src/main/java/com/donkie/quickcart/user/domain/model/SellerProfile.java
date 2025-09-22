package com.donkie.quickcart.user.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "seller_profile")
public class SellerProfile {
    @Id
    @Column(name = "seller_id")
    private UUID sellerId;

    @Column(name = "firstName", length = 2000)
    private String bio;

    @CreatedDate
    @Column(name = "selling_since")
    private Instant sellingSince;

    /*
    Using Composition over Inheritance for extending UserProfile features to seller.
    This allows easy promotion of user from one role to another role.
    */
    @OneToOne
    @JoinColumn(name = "user_profile_id")
    private UserProfile userProfile;
}
