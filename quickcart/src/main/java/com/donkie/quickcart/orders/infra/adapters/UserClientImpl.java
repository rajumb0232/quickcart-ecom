package com.donkie.quickcart.orders.infra.adapters;

import com.donkie.quickcart.orders.application.model.UserSnapshot;
import com.donkie.quickcart.orders.application.port.UserClient;
import com.donkie.quickcart.user.application.service.UserSnapService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@AllArgsConstructor
public class UserClientImpl implements UserClient {
    private final UserSnapService userSnapService;

    @Override
    public UserSnapshot getUserSnapShot(UUID userId) {
        var snap = userSnapService.getUserSnapshot(userId);
        return new UserSnapshot(
                snap.userId(),
                snap.firstName(),
                snap.lastName(),
                snap.email());
    }
}
