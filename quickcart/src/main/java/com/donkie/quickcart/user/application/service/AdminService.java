package com.donkie.quickcart.user.application.service;

import jakarta.annotation.PostConstruct;

public interface AdminService {

    @PostConstruct
    void createDefaultAdmin();
}
