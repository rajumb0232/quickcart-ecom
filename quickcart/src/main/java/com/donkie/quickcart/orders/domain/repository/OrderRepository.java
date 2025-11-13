package com.donkie.quickcart.orders.domain.repository;

import com.donkie.quickcart.orders.domain.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {

    Page<Order> findAllByCreatedBy(String string, Pageable pageable);
}
