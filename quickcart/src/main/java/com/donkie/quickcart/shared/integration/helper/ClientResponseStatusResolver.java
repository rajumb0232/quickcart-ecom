package com.donkie.quickcart.shared.integration.helper;

import com.donkie.quickcart.shared.exception.QuickcartBaseException;
import com.donkie.quickcart.user.infra.exception.ExternalServiceException;
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
            case HttpClientErrorException.Unauthorized ignored -> HttpStatus.UNAUTHORIZED;
            case HttpClientErrorException.Forbidden ignored -> HttpStatus.FORBIDDEN;
            case HttpClientErrorException.TooManyRequests ignored -> HttpStatus.TOO_MANY_REQUESTS;
            case HttpClientErrorException ignored -> HttpStatus.BAD_REQUEST;
            case ResourceAccessException ignored -> HttpStatus.GATEWAY_TIMEOUT;
            case HttpServerErrorException ignored -> HttpStatus.BAD_GATEWAY;
            case ExternalServiceException e -> e.getStatus();
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
