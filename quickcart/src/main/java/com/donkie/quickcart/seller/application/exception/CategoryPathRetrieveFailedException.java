package com.donkie.quickcart.seller.application.exception;

import com.donkie.quickcart.shared.exception.QuickcartBaseException;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;

public class CategoryPathRetrieveFailedException extends QuickcartBaseException {
    public CategoryPathRetrieveFailedException(HttpStatus status, String message) {
        super(status, message);
    }

    public CategoryPathRetrieveFailedException(HttpStatus status, String message, Throwable cause) {
        super(status, message, cause);
    }
}
