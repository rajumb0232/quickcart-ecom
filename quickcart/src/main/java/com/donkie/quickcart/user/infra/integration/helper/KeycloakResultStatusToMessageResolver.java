package com.donkie.quickcart.user.infra.integration.helper;

import org.springframework.http.HttpStatus;

public class KeycloakResultStatusToMessageResolver {

    /**
     * Resolves a given HttpStatus to a human-readable message that can be returned
     * to frontend clients. These messages are deliberately vendor-neutral and
     * describe the nature of the problem in a client-understandable way.
     *
     * @param status         the HttpStatus resolved from the downstream exception
     * @param operationInfo  short description of the attempted operation (e.g., "Login", "User registration")
     * @return a user-facing message
     */
    public static String resolveMessageForClientResponseStatus(HttpStatus status, String operationInfo) {
        operationInfo = (operationInfo == null || operationInfo.isBlank()) ? "Operation" : operationInfo;

        if (status == null) {
            return operationInfo + " failed due to an unexpected error.";
        }

        return switch (status) {
            case UNAUTHORIZED -> operationInfo + " failed, invalid credentials.";
            case FORBIDDEN -> operationInfo + " failed, you do not have the necessary permissions.";
            case TOO_MANY_REQUESTS -> operationInfo + " failed, too many requests. Please try again later.";
            case GATEWAY_TIMEOUT -> operationInfo + " failed, authentication service did not respond in time.";
            case BAD_GATEWAY -> operationInfo + " failed, authentication service is temporarily unavailable.";
            case SERVICE_UNAVAILABLE -> operationInfo + " failed, authentication service is currently unavailable.";
            case INTERNAL_SERVER_ERROR -> operationInfo + " failed due to an internal server error.";
            default -> operationInfo + " failed due to an unexpected error. Please try again.";
        };
    }
}
