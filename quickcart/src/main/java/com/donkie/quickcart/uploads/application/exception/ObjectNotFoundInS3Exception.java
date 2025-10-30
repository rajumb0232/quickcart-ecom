package com.donkie.quickcart.uploads.application.exception;

import com.donkie.quickcart.shared.exception.QuickcartBaseException;
import org.springframework.http.HttpStatus;

public class ObjectNotFoundInS3Exception extends QuickcartBaseException {

    public ObjectNotFoundInS3Exception(HttpStatus status, String message) {
        super(status, message);
    }

    public ObjectNotFoundInS3Exception(HttpStatus status, String message, Throwable cause) {
        super(status, message, cause);
    }
}
