package com.donkie.quickcart.shared.jpa;

import com.donkie.quickcart.shared.security.CurrentUser;
import org.springframework.data.domain.AuditorAware;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component("quickcartAuditor")
public class AuditorAwareImpl implements AuditorAware<String> {

    @Override
    public Optional<String> getCurrentAuditor() {
        return CurrentUser.getCurrentUserId()
                .map(UUID::toString)
                .or(() -> Optional.of("System"));
    }
}
