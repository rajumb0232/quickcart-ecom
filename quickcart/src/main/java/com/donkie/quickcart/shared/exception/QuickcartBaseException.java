package com.donkie.quickcart.shared.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class QuickcartBaseException extends RuntimeException{
    private final HttpStatus status;

    public QuickcartBaseException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public QuickcartBaseException(HttpStatus status, String message, Throwable cause) {
        super(message, cause);
        this.status = status;
    }
}
