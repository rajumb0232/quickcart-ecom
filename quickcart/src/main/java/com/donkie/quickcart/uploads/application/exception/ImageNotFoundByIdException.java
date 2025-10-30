package com.donkie.quickcart.uploads.application.exception;

import com.donkie.quickcart.shared.exception.QuickcartBaseException;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;

public class ImageNotFoundByIdException extends QuickcartBaseException {
    public ImageNotFoundByIdException(HttpStatus status, String message) {
        super(status, message);
    }

    public ImageNotFoundByIdException(HttpStatus status, String message, Throwable cause) {
        super(status, message, cause);
    }
}
