package com.donkie.quickcart.orders.domain.exception;

public class InvalidShippingAddressException extends RuntimeException {
    public InvalidShippingAddressException(String message) {
        super(message);
    }
}
