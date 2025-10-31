package com.donkie.quickcart.seller.application.exception;

import com.donkie.quickcart.shared.exception.QuickcartBaseException;
import org.springframework.http.HttpStatus;

public class StoreNotFoundException extends QuickcartBaseException {

    public StoreNotFoundException(HttpStatus status, String message) {
        super(status, message);
    }

    public StoreNotFoundException(HttpStatus status, String message, Throwable cause) {
        super(status, message, cause);
    }

}
