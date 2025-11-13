package com.donkie.quickcart.orders.domain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.UUID;

@Entity
@Table(name = "order_item")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "item_id", updatable = false, nullable = false)
    private UUID itemId;

    @Column(name = "product_variant_id", nullable = false, updatable = false)
    private UUID productVariantId;

    @Column(name = "store_id", nullable = false, updatable = false)
    private UUID storeId;

    @Column(name = "quantity", nullable = false)
    private int quantity;

    @Column(name = "price", nullable = false)
    private double pricePerUnit;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false, updatable = false)
    private Order order;

    @CreatedBy
    @Column(name = "created_by", updatable = false, nullable = false)
    private String createdBy;

    public static OrderItem create(UUID productVariantId, UUID storeId, int quantity, double pricePerUnit) {
        OrderItem item = new OrderItem();
        item.setProductVariantId(productVariantId);
        item.setStoreId(storeId);
        item.setQuantity(quantity);
        item.setPricePerUnit(pricePerUnit);
        return item;
    }

    public OrderItem associateWith(Order order) {
        this.order = order;
        return this;
    }
}
