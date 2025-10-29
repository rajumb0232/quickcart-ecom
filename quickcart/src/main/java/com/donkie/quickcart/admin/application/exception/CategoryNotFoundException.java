package com.donkie.quickcart.admin.application.exception;

import com.donkie.quickcart.shared.exception.QuickcartBaseException;
import org.springframework.http.HttpStatus;

public class CategoryNotFoundException extends QuickcartBaseException {
    public CategoryNotFoundException(HttpStatus status, String message) {
        super(status, message);
    }

    public CategoryNotFoundException(HttpStatus status, String message, Throwable cause) {
        super(status, message, cause);
    }
}
