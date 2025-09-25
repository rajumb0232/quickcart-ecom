package com.donkie.quickcart.user.api.exception;

import com.donkie.quickcart.shared.dto.ApiAck;
import com.donkie.quickcart.shared.dto.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * Global exception handler for user API endpoints.
 */
@RestControllerAdvice(basePackages = "com.donkie.quickcart.user.api")
@Slf4j
public class UserApiExceptionHandler {

    /**
     * Handles access denied exceptions.
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiAck> handleAccessDenied(AccessDeniedException ex) {
        log.warn("Access denied: {}", ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiAck.error("Access denied"));
    }

    /**
     * Handles runtime exceptions from business logic.
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiAck> handleRuntimeException(RuntimeException ex) {
        log.error("Runtime exception occurred", ex);
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiAck.error(ex.getMessage()));
    }

    /**
     * Handles all other unexpected exceptions.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiAck> handleGenericException(Exception ex) {
        log.error("Unexpected exception occurred", ex);
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiAck.error("An unexpected error occurred"));
    }
}