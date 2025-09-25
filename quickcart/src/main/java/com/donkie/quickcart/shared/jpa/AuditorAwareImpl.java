package com.donkie.quickcart.shared.jpa;

import com.donkie.quickcart.user.infra.security.util.CurrentUser;
import org.springframework.data.domain.AuditorAware;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component("quickcartAuditor")
public class AuditorAwareImpl implements AuditorAware<String> {

    @Override
    public Optional<String> getCurrentAuditor() {
        return CurrentUser.getCurrentUsername()
                .or(() -> Optional.of("System"));
    }
}
