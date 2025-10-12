package com.donkie.quickcart.shared.integration.helper;

import com.donkie.quickcart.shared.exception.QuickcartBaseException;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;


public class ClientResponseStatusResolver {

    /**
     * Resolve the HTTP status from a Throwable.
     *
     * @param t Throwable
     * @return HTTP status
     */
    public static HttpStatus resolveStatus(Throwable t) {
        if (t == null) return HttpStatus.INTERNAL_SERVER_ERROR;

        return switch (t) {
            case HttpClientErrorException.Unauthorized e -> HttpStatus.UNAUTHORIZED;
            case HttpClientErrorException.Forbidden e -> HttpStatus.FORBIDDEN;
            case HttpClientErrorException.TooManyRequests e -> HttpStatus.TOO_MANY_REQUESTS;
            case HttpClientErrorException e -> HttpStatus.BAD_REQUEST;
            case ResourceAccessException e -> HttpStatus.GATEWAY_TIMEOUT;
            case HttpServerErrorException e -> HttpStatus.BAD_GATEWAY;
            default -> HttpStatus.SERVICE_UNAVAILABLE;
        };
    }

    /**
     * Resolve the HTTP status from a QuickcartBaseException.
     *
     * @param ex QuickcartBaseException
     * @return HTTP status
     */
    public static HttpStatus resolveBaseExceptionStatus(Throwable ex) {
        HttpStatus status = null;

        if (ex instanceof QuickcartBaseException e)
            status = e.getStatus();
        if (status == null)
            status = HttpStatus.INTERNAL_SERVER_ERROR;

        return status;
    }

}
