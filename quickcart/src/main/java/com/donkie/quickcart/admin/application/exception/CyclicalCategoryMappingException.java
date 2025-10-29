package com.donkie.quickcart.admin.application.exception;

import com.donkie.quickcart.shared.exception.QuickcartBaseException;
import org.springframework.http.HttpStatus;

public class CyclicalCategoryMappingException extends QuickcartBaseException {
    public CyclicalCategoryMappingException(HttpStatus status, String message) {
        super(status, message);
    }

    public CyclicalCategoryMappingException(HttpStatus status, String message, Throwable cause) {
        super(status, message, cause);
    }
}
