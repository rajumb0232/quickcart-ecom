package com.donkie.quickcart.user.infra.integration.helper;

import com.donkie.quickcart.user.infra.exception.ExternalServiceException;
import org.springframework.http.HttpStatus;

import static com.donkie.quickcart.shared.integration.helper.ClientResponseStatusResolver.resolveStatus;
import static com.donkie.quickcart.user.infra.integration.helper.KeycloakResultStatusToMessageResolver.resolveMessageForClientResponseStatus;

public class InfraExceptionBuilder {

    /**
     * Builds an ExternalServiceException based on the provided Throwable and operation information.
     *
     * @param t The Throwable that occurred during the operation.
     * @param operationInfo The operation information to include in the exception message.
     * @return An ExternalServiceException with the appropriate status and message.
     */
    public static ExternalServiceException buildExternalServiceException(Throwable t, String operationInfo) {
        HttpStatus status = resolveStatus(t);
        return new ExternalServiceException(
                        status,
                        resolveMessageForClientResponseStatus(status, operationInfo),
                        t);
    }
}
