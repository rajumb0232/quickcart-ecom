package com.donkie.quickcart.user.application.service;

import com.donkie.quickcart.user.infra.integration.keycloak.model.UserRegistrationRequest;

public interface AdminService {

    void createAdmin(UserRegistrationRequest request);
}
