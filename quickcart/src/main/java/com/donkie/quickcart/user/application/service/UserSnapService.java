package com.donkie.quickcart.user.application.service;


import com.donkie.quickcart.user.adapters.dto.UserSnapshot;

import java.util.UUID;

public interface UserSnapService {

    UserSnapshot getUserSnapshot(UUID userId);
}
