package com.donkie.quickcart.orders.application.exception;

public class CartNotFoundException extends RuntimeException{
    public CartNotFoundException(String s) {
        super(s);
    }
}
