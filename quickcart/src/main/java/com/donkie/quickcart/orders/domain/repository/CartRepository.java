package com.donkie.quickcart.orders.domain.repository;

import com.donkie.quickcart.orders.domain.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CartRepository extends JpaRepository<Cart, UUID> {

    Optional<Cart> findByCreatedBy(String createdBy);
}
