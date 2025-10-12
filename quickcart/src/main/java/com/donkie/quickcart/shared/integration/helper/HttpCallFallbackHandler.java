package com.donkie.quickcart.shared.integration.helper;

import lombok.extern.slf4j.Slf4j;

import java.util.Objects;
import java.util.function.Supplier;

@Slf4j
public class HttpCallFallbackHandler {

    /**
     * Throws an exception based on the provided supplier. Logs the error message and the exception itself.
     *
     * @param exceptionSupplier the supplier that returns the exception to be thrown
     * @param <T>               ignored return type, used to avoid compiler errors on caller methods excepting return type.
     */
    public static <T> T throwException(Supplier<? extends RuntimeException> exceptionSupplier) {
        Objects.requireNonNull(exceptionSupplier, "exceptionSupplier must not be null");
        RuntimeException ex = exceptionSupplier.get();
        log.error("External call failed: {}", ex.getMessage(), ex);
        throw ex;
    }

    /**
     * Logs a warning and returns a fallback value when an external call fails.
     *
     * @param fallbackValue the default value to return if the exception is thrown
     * @param message       the error message to log if the exception is thrown
     * @param <T>           the type of the value to return
     * @return the default value or the exception itself if an exception is thrown
     */
    public static <T> T returnFallback(T fallbackValue, String message) {
        log.warn("External call failed - returning fallback value. Reason: {}", message);
        return fallbackValue;
    }
}
