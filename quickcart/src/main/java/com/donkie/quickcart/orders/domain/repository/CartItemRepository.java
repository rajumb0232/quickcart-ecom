package com.donkie.quickcart.orders.domain.repository;

import com.donkie.quickcart.orders.domain.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CartItemRepository extends JpaRepository<CartItem, UUID> {
}
