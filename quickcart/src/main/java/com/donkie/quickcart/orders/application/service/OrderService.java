package com.donkie.quickcart.orders.application.service;

import com.donkie.quickcart.orders.application.dto.response.OrderItemResponse;
import com.donkie.quickcart.orders.application.dto.response.OrderResponse;
import com.donkie.quickcart.shared.dto.PageContainer;

import java.util.UUID;

public interface OrderService {

    void createOrder(UUID cartId);

    void confirmOrder(UUID orderId);

    void shipOrder(UUID orderId);

    void completeOrderDelivery(UUID orderId);

    void cancelOrder(UUID orderId);

    OrderItemResponse getOrdersForSeller(UUID storeId);

    OrderResponse getOrder(UUID orderId);

    PageContainer<OrderResponse> getMyOrder(int page, int size);
}
