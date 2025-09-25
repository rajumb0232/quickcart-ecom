package com.donkie.quickcart.user.infra.exception;

public class KeycloakClientException extends RuntimeException {
    private final int status;
    private final String body;

    public KeycloakClientException(int status, String body) {
        super("KeycloakRequestHandler error: " + status + " " + (body == null ? "" : body));
        this.status = status;
        this.body = body;
    }

    public int status() { return status; }
    public String body() { return body; }
}

