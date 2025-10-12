package com.donkie.quickcart.user.infra.exception;

import com.donkie.quickcart.shared.exception.QuickcartBaseException;
import lombok.Getter;
import org.springframework.http.HttpStatus;

public class ExternalServiceException extends QuickcartBaseException {

    public ExternalServiceException(HttpStatus status, String message) {
        super(status, message);
    }

    public ExternalServiceException(HttpStatus status, String message, Throwable ex) {
        super(status, message, ex);
    }
}
