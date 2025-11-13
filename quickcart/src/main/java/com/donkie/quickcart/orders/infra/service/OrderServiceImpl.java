package com.donkie.quickcart.orders.infra.service;

import com.donkie.quickcart.orders.application.dto.response.OrderItemResponse;
import com.donkie.quickcart.orders.application.dto.response.OrderResponse;
import com.donkie.quickcart.orders.application.exception.OrderNotFoundException;
import com.donkie.quickcart.orders.application.port.ProductClient;
import com.donkie.quickcart.orders.application.port.UserClient;
import com.donkie.quickcart.orders.application.service.OrderService;
import com.donkie.quickcart.orders.domain.model.Cart;
import com.donkie.quickcart.orders.domain.model.Order;
import com.donkie.quickcart.orders.domain.model.OrderItem;
import com.donkie.quickcart.orders.domain.repository.OrderItemRepository;
import com.donkie.quickcart.orders.domain.repository.OrderRepository;
import com.donkie.quickcart.shared.dto.PageContainer;
import com.donkie.quickcart.shared.security.util.CurrentUser;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static com.donkie.quickcart.shared.security.util.OwnershipEvaluator.ensureOwnership;
import static com.donkie.quickcart.shared.security.util.OwnershipEvaluator.isOwner;

@Slf4j
@Service
@AllArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductClient productClient;
    private final UserClient userClient;
    private final CartServiceHelper cartServiceHelper;

    @Transactional
    @Override
    public void createOrder(UUID cartId, String shippingAddress) {
        Cart cart = cartServiceHelper.getCartIfOwner(cartId);

        var items = cart.getCartItems()
                .stream()
                .map(item -> {
                    var productId = item.getProductVariantId();
                    var productSnapshot = productClient.getProductSnapShot(productId);
                    return OrderItem.create(
                            item.getProductVariantId(),
                            item.getStoreId(),
                            item.getQuantity(),
                            productSnapshot.pricePerUnit()); // price in real-time
                }).toList();

        var order = Order.create(shippingAddress, items);
        orderRepository.save(order); // cascades to associated OrderItems.
    }

    @Transactional
    @Override
    public void confirmOrder(UUID orderId) {
        Order order = getOrderIfOwner(orderId);
        order.confirmOrder(); // updates order status as CONFIRMED & payment status as PAID.
        orderRepository.save(order);
    }

    @Transactional
    @Override
    public void shipOrder(UUID orderId) {
        Order order = getOrderIfOwner(orderId);
        order.shipProduct();
        orderRepository.save(order);
    }

    @Transactional
    @Override
    public void completeOrderDelivery(UUID orderId) {
        Order order = getOrderIfOwner(orderId);
        order.deliverProduct();
        orderRepository.save(order);
    }

    @Transactional
    @Override
    public void cancelOrder(UUID orderId) {
        Order order = getOrderIfOwner(orderId);
        order.cancelOrder();
        orderRepository.save(order);
    }

    @Transactional(readOnly = true)
    @Override
    public PageContainer<OrderItemResponse> getOrdersForSeller(UUID storeId, int page, int size) {
        var storeSnap = productClient.getStoreSnapshot(storeId);
        ensureOwnership(storeSnap.ownerId().toString());

        Pageable pageable = PageRequest.of(page, size, Sort.by("created_date"));
        var items = orderItemRepository.findByStoreId(storeId, pageable);

        var listOfOrders = items.stream()
                .filter(this::isUserIdUUID)
                .map(i -> {
                    var productSnapshot = productClient.getProductSnapShot(i.getProductVariantId());
                    UUID userId = UUID.fromString(i.getCreatedBy());
                    var userSnapshot = userClient.getUserSnapShot(userId);

                    return new OrderItemResponse(
                            i.getItemId(),
                            i.getQuantity(),
                            i.getOrder().getCreatedDate(),
                            productSnapshot,
                            userSnapshot
                    );
                }).toList();

        return PageContainer.create(
                items.getNumber(),
                items.getSize(),
                items.getTotalElements(),
                items.getTotalPages(),
                listOfOrders);
    }

    @Transactional(readOnly = true)
    @Override
    public OrderResponse getOrder(UUID orderId) {
        var order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Failed to find order by Id: " + orderId));

        return buildOrderResponse(order);
    }

    @Override
    public PageContainer<OrderResponse> getMyOrder(int page, int size) {
        UUID userId = CurrentUser.getCurrentUserId().orElseThrow(() -> new AccessDeniedException("Could not find authentication."));

        Pageable pageable = PageRequest.of(page, size, Sort.Direction.ASC);
        var pageData = orderRepository.findAllByCreatedBy(userId.toString(), pageable);

        var listOfOrders = pageData.stream()
                .map(this::buildOrderResponse).toList();

        return PageContainer.create(
                pageData.getNumber(),
                pageData.getSize(),
                pageData.getTotalElements(),
                pageData.getTotalPages(),
                listOfOrders);
    }

    // ========================= Private Helpers =========================

    private OrderResponse buildOrderResponse(Order order) {
        var builder = OrderResponse.builderInit(
                order.getOrderId(),
                order.getCreatedDate(),
                order.getBillAmount(),
                order.getOrderStatus(),
                order.getPaymentStatus()
        );

        order.getOrderItems().forEach(item -> {
            var productSnapshot = productClient.getProductSnapShot(item.getProductVariantId());
            var storeSnapshot = productClient.getStoreSnapshot(item.getStoreId());
            builder.addItem(item.getItemId(), item.getQuantity(), productSnapshot, storeSnapshot);
        });

        return builder.build();
    }

    private Order getOrderIfOwner(UUID orderId) {
        return orderRepository.findById(orderId)
                .filter(o -> isOwner(o.getCreatedBy()))
                .orElseThrow(() -> new OrderNotFoundException("Failed to find order by Id: " + orderId));
    }

    private boolean isUserIdUUID(OrderItem i) {
        try {
            UUID.fromString(i.getCreatedBy());
            return true;
        } catch (Exception e) {
            log.error("Failed to resolve userId for order item: {}", i.getItemId());
            return false;
        }
    }
}
