package com.donkie.quickcart.shared.exception.handler;

import com.donkie.quickcart.shared.exception.QuickcartBaseException;

import java.util.Objects;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;

/**
 * Helper class to safely execute operations and handle exceptions.
 */
public class SafeExecutor {

    /**
     * Throws an exception based on the provided supplier. Logs the error message and the exception itself.
     *
     * @param operationSupplier the supplier that returns the operation to be executed
     * @param exceptionMapper the function that maps the exception to a new exception
     * @return the result of the operation or the mapped exception
     * @param <T> the type of the result
     */
    public static <T> T safeExecute(
            Supplier<T> operationSupplier,
            Function<Throwable, ? extends RuntimeException> exceptionMapper) {

        Objects.requireNonNull(operationSupplier, "operationSupplier must not be null");
        Objects.requireNonNull(exceptionMapper, "exceptionMapper must not be null");

        try {
            return operationSupplier.get();
        } catch (Exception e) {
            throw exceptionMapper.apply(e);
        }
    }

    public static void safeExecute(
            Runnable operation,
            Function<Throwable, ? extends RuntimeException> exceptionMapper) {

        Objects.requireNonNull(operation, "operation must not be null");
        Objects.requireNonNull(exceptionMapper, "exceptionMapper must not be null");

        try {
             operation.run();
        } catch (Exception e) {
            throw exceptionMapper.apply(e);
        }
    }

    public static void executeOrElseDo(
            Runnable operation,
            Consumer<? super QuickcartBaseException> alternateOperation) {

        Objects.requireNonNull(operation, "operation must not be null");
        Objects.requireNonNull(alternateOperation, "exceptionMapper must not be null");

        try {
            operation.run();
        } catch (QuickcartBaseException e) {
            alternateOperation.accept(e);
        }
    }

    public static void actIf(
            Supplier<Boolean> check,
            Runnable action
    ) {
        Objects.requireNonNull(check, "check must not be null");
        Objects.requireNonNull(action, "action must not be null");

        if (check.get()) action.run();
    }
}
