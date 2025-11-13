package com.donkie.quickcart.orders.api.controller;

import com.donkie.quickcart.orders.application.dto.request.AddCartItemRequest;
import com.donkie.quickcart.orders.application.dto.response.CartResponse;
import com.donkie.quickcart.orders.application.service.CartService;
import com.donkie.quickcart.shared.dto.ApiAck;
import com.donkie.quickcart.shared.dto.ApiResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@AllArgsConstructor
public class CartController {
    private final CartService cartService;

    @RequestMapping("/carts")
    public ResponseEntity<ApiAck> createCart() {
        cartService.createCart();
        return ResponseEntity.ok(ApiAck.success("Cart created successfully."));
    }

    @PostMapping("/carts/{cartId}/items")
    public ResponseEntity<ApiAck> addItemToCart(UUID cartId, AddCartItemRequest request) {
        cartService.addItemToCart(cartId, request);
        return ResponseEntity.ok(ApiAck.success("Item added to cart successfully."));
    }

    @DeleteMapping("/cart-items/{itemId}")
    public ResponseEntity<ApiAck> removeCartItem(UUID itemId) {
        cartService.removeCartItem(itemId);
        return ResponseEntity.ok(ApiAck.success("Item removed from cart successfully."));
    }

    @GetMapping("/carts/{cartId}")
    public ResponseEntity<ApiResponse<CartResponse>> getCart(UUID cartId) {
        var response = cartService.getCart(cartId);
        return ResponseEntity.ok(ApiResponse.success("Cart retrieved successfully.", response));
    }

}
