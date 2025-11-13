package com.donkie.quickcart.orders.domain.repository;

import com.donkie.quickcart.orders.domain.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {

    List<OrderItem> findByProductId(UUID productId);
}
