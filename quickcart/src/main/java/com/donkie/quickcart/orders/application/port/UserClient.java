package com.donkie.quickcart.orders.application.port;

import com.donkie.quickcart.orders.application.model.UserSnapshot;

import java.util.UUID;

public interface UserClient {

    UserSnapshot getUserSnapShot(UUID userId);
}
