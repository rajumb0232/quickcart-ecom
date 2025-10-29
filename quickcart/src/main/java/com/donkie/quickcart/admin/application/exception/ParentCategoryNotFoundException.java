package com.donkie.quickcart.admin.application.exception;

import com.donkie.quickcart.shared.exception.QuickcartBaseException;
import org.springframework.http.HttpStatus;

public class ParentCategoryNotFoundException extends QuickcartBaseException {

    public ParentCategoryNotFoundException(HttpStatus status, String message) {
        super(status, message);
    }

    public ParentCategoryNotFoundException(HttpStatus status, String message, Throwable cause) {
        super(status, message, cause);
    }
}
