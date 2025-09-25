package com.donkie.quickcart.user.infra.integration.keycloak.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * Request model for registering a new user in KeycloakRequestHandler.
 * Maps to the KeycloakRequestHandler Admin API user creation request format.
 */
public record UserRegistrationRequest(
        @JsonProperty("username") String username,
        @JsonProperty("email") String email,
        @JsonProperty("enabled") Boolean enabled,
        @JsonProperty("emailVerified") Boolean emailVerified,
        @JsonProperty("credentials") List<UserCredential> credentials
) {
    
    /**
     * Represents a user credential (password) in the registration request.
     */
    public record UserCredential(
            @JsonProperty("type") String type,
            @JsonProperty("value") String value,
            @JsonProperty("temporary") Boolean temporary
    ) {
        /**
         * Creates a permanent password credential.
         * 
         * @param password the password value
         * @return UserCredential with type "password" and temporary=false
         */
        public static UserCredential password(String password) {
            return new UserCredential("password", password, false);
        }
    }
    
    /**
     * Creates a UserCredentials with default settings.
     * 
     * @param email the user's email (also used as username)
     * @param password the user's password
     * @return UserCredentials with enabled=true, emailVerified=true
     */
    public static UserRegistrationRequest create(String email, String password) {
        return new UserRegistrationRequest(
                email, // username same as email
                email,
                true, // enabled
                true, // emailVerified
                List.of(UserCredential.password(password))
        );
    }
}
