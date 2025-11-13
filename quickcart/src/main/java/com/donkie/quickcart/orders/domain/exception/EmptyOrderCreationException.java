package com.donkie.quickcart.orders.domain.exception;

public class EmptyOrderCreationException extends RuntimeException {
    public EmptyOrderCreationException(String message) {
        super(message);
    }
}
