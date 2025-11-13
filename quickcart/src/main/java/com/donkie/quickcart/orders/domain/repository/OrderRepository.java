package com.donkie.quickcart.orders.domain.repository;

import com.donkie.quickcart.orders.domain.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {

    List<Order> findByCreatedBy(String createdBy);
}
