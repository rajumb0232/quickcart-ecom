package com.donkie.quickcart.user.infra.service;

import com.donkie.quickcart.user.adapters.dto.UserSnapshot;
import com.donkie.quickcart.user.application.service.UserSnapService;
import com.donkie.quickcart.user.domain.repository.UserProfileRepo;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@AllArgsConstructor
public class UserSnapServiceImpl implements UserSnapService {
    private final UserProfileRepo userRepository;

    @Transactional
    @Override
    public UserSnapshot getUserSnapshot(UUID userId) {
        return userRepository.findById(userId)
                .map(profile -> new UserSnapshot(
                        profile.getUserId(),
                        profile.getFirstName(),
                        profile.getLastName(),
                        profile.getEmail()))
                .orElseThrow(() -> new UsernameNotFoundException("Failed to find user profile by Id: " + userId));
    }
}
