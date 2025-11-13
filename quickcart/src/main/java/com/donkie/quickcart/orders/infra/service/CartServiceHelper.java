package com.donkie.quickcart.orders.infra.service;

import com.donkie.quickcart.orders.application.exception.CartNotFoundException;
import com.donkie.quickcart.orders.domain.model.Cart;
import com.donkie.quickcart.orders.domain.repository.CartRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

import static com.donkie.quickcart.shared.security.util.OwnershipEvaluator.isOwner;

@Service
@AllArgsConstructor
public class CartServiceHelper {
    private final CartRepository cartRepository;

    public Cart getCartIfOwner(UUID cartId) {
        return cartRepository.findById(cartId)
                .filter(c -> isOwner(c.getCreatedBy()))
                .orElseThrow(() -> new CartNotFoundException("Failed to find cart by Id: " + cartId));
    }
}
