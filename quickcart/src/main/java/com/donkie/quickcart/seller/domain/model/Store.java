package com.donkie.quickcart.seller.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.UUID;

@Entity
@Table(name = "store")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
public class Store {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "store_id")
    private UUID storeId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "location")
    private String location;

    @Column(name = "contact_number")
    private String contactNumber;

    @Column(name = "email")
    private String email;

    @Column(name = "about")
    private String about;

    @Embedded
    private LifecycleAudit lifecycleAudit = new LifecycleAudit();

    // Builder for controlled instantiation
    @Builder
    public Store(String name, String location, String contactNumber, String email, String about) {
        this.name = name;
        this.location = location;
        this.contactNumber = contactNumber;
        this.email = email;
        this.about = about;
    }

    public boolean isActive() {
        return this.getLifecycleAudit().isActive();
    }

    public String ownerId() {
        return this.getLifecycleAudit().getCreatedBy();
    }
}
