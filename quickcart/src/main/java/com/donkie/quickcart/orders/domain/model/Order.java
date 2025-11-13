package com.donkie.quickcart.orders.domain.model;

import com.donkie.quickcart.orders.domain.exception.EmptyOrderCreationException;
import com.donkie.quickcart.orders.domain.exception.InvalidShippingAddressException;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "order")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "order_id", nullable = false, updatable = false)
    private UUID orderId;

    @Column(name = "bill_amount", nullable = false, updatable = false)
    private double billAmount;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems = new ArrayList<>();

    @Column(name = "payment_id")
    private String paymentId;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    private PaymentStatus paymentStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_status", nullable = false)
    private OrderStatus orderStatus;

    @Column(name = "shipping_address", length = 300, nullable = false)
    private String shippingAddress;

    @CreatedBy
    @Column(name = "created_by", updatable = false, nullable = false)
    private String createdBy;

    @CreatedDate
    @Column(name = "created_date", updatable = false, nullable = false)
    private Instant createdDate;

    @LastModifiedDate
    @Column(name = "last_modified_date", nullable = false)
    private Instant lastModifiedDate;

    public static Order create(String shippingAddress, List<OrderItem> items) {
        if (items.isEmpty())
            throw new EmptyOrderCreationException("Order items cannot be empty.");
        if (shippingAddress == null || shippingAddress.isEmpty())
            throw new InvalidShippingAddressException("Shipping address cannot be null or empty.");

        var amount = items.stream().mapToDouble(i -> i.getQuantity() * i.getPricePerUnit()).sum();

        Order order = new Order();
        order.setOrderItems(items);
        order.setBillAmount(amount);
        order.setPaymentStatus(PaymentStatus.PENDING);
        order.setOrderStatus(OrderStatus.CREATED);
        order.setShippingAddress(shippingAddress);
        return order;
    }

    public void completeOrder(String paymentId) {
        Objects.requireNonNull(paymentId, "Payment ID cannot be null.");
        this.paymentId = paymentId;
        this.paymentStatus = PaymentStatus.PAID;
        this.orderStatus = OrderStatus.CONFIRMED;
    }

    public void confirmOrder() {
        this.orderStatus = OrderStatus.CONFIRMED;
        this.paymentStatus = PaymentStatus.PAID;
    }

    public void shipProduct() {
        this.orderStatus = OrderStatus.SHIPPED;
    }

    public void deliverProduct() {
        this.orderStatus = OrderStatus.DELIVERED;
    }

    public void cancelOrder() {
        this.orderStatus = OrderStatus.CANCELLED;
        this.paymentStatus = PaymentStatus.REFUND_INITIATED;
    }
}
