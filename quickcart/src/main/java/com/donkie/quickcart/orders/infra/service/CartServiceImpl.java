package com.donkie.quickcart.orders.infra.service;

import com.donkie.quickcart.orders.application.dto.request.AddCartItemRequest;
import com.donkie.quickcart.orders.application.dto.response.CartResponse;
import com.donkie.quickcart.orders.application.port.ProductClient;
import com.donkie.quickcart.orders.application.service.CartService;
import com.donkie.quickcart.orders.domain.model.Cart;
import com.donkie.quickcart.orders.domain.model.CartItem;
import com.donkie.quickcart.orders.domain.repository.CartItemRepository;
import com.donkie.quickcart.orders.domain.repository.CartRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static com.donkie.quickcart.shared.security.util.OwnershipEvaluator.ensureOwnership;

@Service
@AllArgsConstructor
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository itemRepository;
    private final ProductClient productClient;
    private final CartServiceHelper cartServiceHelper;

    @Transactional
    @Override
    public void addItemToCart(UUID cartId, AddCartItemRequest request) {
        var cart = cartServiceHelper.getCartIfOwner(cartId);

        var item = CartItem.create(
                        request.productVariantId(),
                        request.storeId(),
                        request.quantity())
                .associateWith(cart);

        itemRepository.save(item);
    }

    @Transactional
    @Override
    public void removeCartItem(UUID itemId) {
        itemRepository.findById(itemId)
                .ifPresent(item -> ensureOwnership(item.getCreatedBy()));
        itemRepository.deleteById(itemId);
    }

    @Transactional(readOnly = true)
    @Override
    public CartResponse getCart(UUID cartId) {
        var cart = cartServiceHelper.getCartIfOwner(cartId);

        var builder = CartResponse.builder(cart.getCartId());

        cart.getCartItems().forEach(item -> {
            var productId = item.getProductVariantId();
            var productSnapshot = productClient.getProductSnapShot(productId);
            builder.addItem(item.getItemId(), item.getQuantity(), productSnapshot);
        });

        return builder.build();
    }

    @Override
    public void createCart() {
        cartRepository.save(Cart.create());
    }
}
