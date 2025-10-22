package com.donkie.quickcart.user.infra.service;

import com.donkie.quickcart.shared.config.ApplicationProperties;
import com.donkie.quickcart.user.application.service.AdminService;
import com.donkie.quickcart.user.infra.integration.keycloak.KeycloakClient;
import com.donkie.quickcart.user.infra.integration.keycloak.model.UserRegistrationRequest;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final ApplicationProperties props;
    private final KeycloakClient keycloakClient;

    @Override
    public void createAdmin(UserRegistrationRequest request) {
        var username = props.getAdmin().getUsername();
        var password = props.getAdmin().getPassword();

        // Register User and map roles "customer, seller, admin".
        // Create helper method for retry mechanism, may be with supplier implementation.
    }
}
