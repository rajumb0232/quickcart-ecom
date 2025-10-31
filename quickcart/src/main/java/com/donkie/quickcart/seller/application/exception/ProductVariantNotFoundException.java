package com.donkie.quickcart.seller.application.exception;

import com.donkie.quickcart.shared.exception.QuickcartBaseException;
import org.springframework.http.HttpStatus;

public class ProductVariantNotFoundException extends QuickcartBaseException {

    public ProductVariantNotFoundException(HttpStatus status, String message) {
        super(status, message);
    }

    public ProductVariantNotFoundException(HttpStatus status, String message, Throwable cause) {
        super(status, message, cause);
    }

}
