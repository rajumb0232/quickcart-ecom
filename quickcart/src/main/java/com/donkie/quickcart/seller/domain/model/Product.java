package com.donkie.quickcart.seller.domain.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "product")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "product_id")
    private UUID productId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "brand", nullable = false)
    private String brand;

    @Column(name = "category_path", nullable = false)
    private String categoryPath; // derived from associated category for FTS

    // uni-directional (de-coupled reference to category)
    @Column(name = "category_id")
    private UUID categoryId;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductVariant> variants = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id")
    private Store store;

    @Column(name = "avg_rating")
    private double avgRating;

    @Column(name = "rating_count")
    private int ratingCount;

    @Embedded
    private LifecycleAudit lifecycleAudit = new LifecycleAudit();

    // Builder for controlled instantiation
    @Builder
    public Product(String title,
                   String description,
                   String brand,
                   String categoryPath,
                   UUID categoryId,
                   Store store) {
        this.title = title;
        this.description = description;
        this.brand = brand;
        this.categoryId = categoryId;
        this.categoryPath = categoryPath;
        this.store = store;
        this.lifecycleAudit.setActive(false);
    }

    public boolean isActive() {
        return this.getLifecycleAudit().isActive();
    }

    public String ownerId() {
        return this.getLifecycleAudit().getCreatedBy();
    }

}
