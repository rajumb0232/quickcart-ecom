package com.donkie.quickcart.seller.application.exception;

import com.donkie.quickcart.shared.exception.QuickcartBaseException;
import org.springframework.http.HttpStatus;

public class ProductNotFoundException extends QuickcartBaseException {

    public ProductNotFoundException(HttpStatus status, String message) {
        super(status, message);
    }

    public ProductNotFoundException(HttpStatus status, String message, Throwable cause) {
        super(status, message, cause);
    }

}
