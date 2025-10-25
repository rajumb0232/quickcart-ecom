package com.donkie.quickcart.user.infra.exception;

import com.donkie.quickcart.shared.exception.QuickcartBaseException;
import org.springframework.http.HttpStatus;

public class UserLoginRefreshFailedException extends QuickcartBaseException {
    public UserLoginRefreshFailedException(HttpStatus status, String message) {
        super(status, message);
    }

    public UserLoginRefreshFailedException(HttpStatus status, String message, Throwable ex) {
        super(status, message, ex);
    }
}
