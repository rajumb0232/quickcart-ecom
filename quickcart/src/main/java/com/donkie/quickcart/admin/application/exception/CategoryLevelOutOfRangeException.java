package com.donkie.quickcart.admin.application.exception;

import com.donkie.quickcart.shared.exception.QuickcartBaseException;
import org.springframework.http.HttpStatus;

public class CategoryLevelOutOfRangeException extends QuickcartBaseException {
    public CategoryLevelOutOfRangeException(HttpStatus status, String message) {
        super(status, message);
    }

    public CategoryLevelOutOfRangeException(HttpStatus status, String message, Throwable cause) {
        super(status, message, cause);
    }
}

