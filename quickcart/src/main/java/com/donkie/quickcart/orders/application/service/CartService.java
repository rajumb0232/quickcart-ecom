package com.donkie.quickcart.orders.application.service;

import com.donkie.quickcart.orders.application.dto.response.CartResponse;
import com.donkie.quickcart.orders.application.dto.request.AddCartItemRequest;

import java.util.UUID;

public interface CartService {

    void addItemToCart(UUID cartId, AddCartItemRequest request);

    void removeCartItem(UUID itemId);

    CartResponse getCart(UUID cartId);

    void createCart();
}
