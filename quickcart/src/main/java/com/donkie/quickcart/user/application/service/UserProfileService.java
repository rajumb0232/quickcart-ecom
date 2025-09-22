package com.donkie.quickcart.user.application.service;

import com.donkie.quickcart.user.application.model.UserProfileCommand;
import com.donkie.quickcart.user.application.model.UserProfileResult;
import com.donkie.quickcart.user.domain.model.UserProfile;
import com.donkie.quickcart.user.domain.repository.UserProfileRepo;
import com.donkie.quickcart.user.infra.integration.client.KeycloakClient;
import com.donkie.quickcart.user.infra.integration.model.KeycloakUserData;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import static com.donkie.quickcart.user.infra.security.util.CurrentUser.getCurrentUsername;

@Service
@AllArgsConstructor
public class UserProfileService {

    private final UserProfileRepo userProfileRepo;
    private final KeycloakClient keycloakClient;

    public UserProfileResult.Detail createUserProfile(UserProfileCommand.Create create) {

        KeycloakUserData keycloakUserData = getCurrentUsername().map(keycloakClient::getUserDetails)
                .orElseThrow(() -> new RuntimeException("User credentials not found"));

        UserProfile userProfile = UserProfile.builder()
                .firstName(create.firstName())
                .lastName(create.lastName())
                .dateOfBirth(create.dateOfBirth())
                .phoneNumber(create.phoneNumber())
                .email(keycloakUserData.email())
                .userId(keycloakUserData.userId())
                .build();

        userProfileRepo.save(userProfile);
        return mapToUserProfileResultDetail(userProfile);
    }


    private static UserProfileResult.Detail mapToUserProfileResultDetail(UserProfile userProfile) {
        return new UserProfileResult.Detail(
                userProfile.getUserId(),
                userProfile.getFirstName(),
                userProfile.getLastName(),
                userProfile.getEmail(),
                userProfile.getDateOfBirth(),
                userProfile.getCreateDate(),
                userProfile.getLastModifiedDate()
        );
    }
}
