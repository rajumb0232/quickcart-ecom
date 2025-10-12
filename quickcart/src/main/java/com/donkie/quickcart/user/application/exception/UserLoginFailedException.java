package com.donkie.quickcart.user.application.exception;

import com.donkie.quickcart.shared.exception.QuickcartBaseException;
import lombok.Getter;
import org.springframework.http.HttpStatus;

public class UserLoginFailedException extends QuickcartBaseException {
    public UserLoginFailedException(HttpStatus status, String message) {
        super(status, message);
    }

    public UserLoginFailedException(HttpStatus status, String message, Throwable ex) {
        super(status, message, ex);
    }
}
