package com.donkie.quickcart.seller.domain.model;

import com.donkie.quickcart.uploads.domain.model.ImageFile;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "product_variant")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "variant_id")
    private UUID variantId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "price", nullable = false)
    private double price;

    @Column(name = "quantity", nullable = false)
    private int quantity;

    @Column(name = "description")
    private String description;

    // Stored as JSONB in PostgreSQL
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "attributes", columnDefinition = "jsonb")
    private Map<String, String> attributes;

    // Images - unidirectional many-to-many (each variant can have multiple images)
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "product_variant_images",
            joinColumns = @JoinColumn(name = "variant_id"),
            inverseJoinColumns = @JoinColumn(name = "image_id")
    )
    private List<ImageFile> images = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Embedded
    private LifecycleAudit lifecycleAudit = new LifecycleAudit();

    // Builder for controlled instantiation
    @Builder
    public ProductVariant(String title,
                          double price,
                          int quantity,
                          String description,
                          Map<String, String> attributes,
                          Product product) {
        this.title = title;
        this.price = price;
        this.quantity = quantity;
        this.description = description;
        this.attributes = attributes;
        this.product = product;
        this.lifecycleAudit.setActive(false);
    }

    public boolean isActive() {
        return this.getLifecycleAudit().isActive();
    }

    public String ownerId() {
        return this.getLifecycleAudit().getCreatedBy();
    }
}
