package com.donkie.quickcart.orders.application.exception;

public class OrderNotFoundException extends RuntimeException{
    public OrderNotFoundException(String s) {
        super(s);
    }
}
