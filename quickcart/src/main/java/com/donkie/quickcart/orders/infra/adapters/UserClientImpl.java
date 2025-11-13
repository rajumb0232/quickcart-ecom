package com.donkie.quickcart.orders.infra.adapters;

import com.donkie.quickcart.orders.application.model.UserSnapshot;
import com.donkie.quickcart.orders.application.port.UserClient;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@AllArgsConstructor
public class UserClientImpl implements UserClient {

    @Override
    public UserSnapshot getUserSnapShot(UUID userId) {
        return null;
    }
}
