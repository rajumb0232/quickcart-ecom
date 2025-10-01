package com.donkie.quickcart.user.api.mapper;

import com.donkie.quickcart.user.api.dto.request.UpdateUserProfileRequest;
import com.donkie.quickcart.user.api.dto.request.UserCredentials;
import com.donkie.quickcart.user.api.dto.response.UserProfileResponse;
import com.donkie.quickcart.user.api.dto.response.UserRoleProfile;
import com.donkie.quickcart.user.application.model.UserProfileCommand;
import com.donkie.quickcart.user.application.model.UserProfileResult;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

/**
 * Mapper for converting between API DTOs and Application models.
 */
@Component
public class UserProfileApiMapper {

    /**
     * Maps API registration request to application command.
     */
    public UserProfileCommand.Register toRegisterCommand(UserCredentials request) {
        return new UserProfileCommand.Register(
                request.email(),
                request.password()
        );
    }

    /**
     * Maps API update request to application command.
     */
    public UserProfileCommand.Update toUpdateCommand(UpdateUserProfileRequest request) {
        return new UserProfileCommand.Update(
                request.firstName(),
                request.lastName(),
                request.phoneNumber()
        );
    }

    /**
     * Maps application result to API response.
     */
    public UserProfileResponse toResponse(UserProfileResult.Detail result) {
        return new UserProfileResponse(
                result.userId(),
                result.firstName(),
                result.lastName(),
                result.email(),
                result.createdDate(),
                result.lastModifiedDate(),
                mapRoles(result.profiles())
        );
    }

    private List<UserRoleProfile.Role> mapRoles(List<UserProfileResult.RoleProfile> profiles) {
        if (profiles == null || profiles.isEmpty()) return List.of();
        return profiles.stream().map(this::mapRole).toList();
    }

    private UserRoleProfile.Role mapRole(UserProfileResult.RoleProfile p) {
        return switch (p) {
            case UserProfileResult.SellerProfileDetail s -> new UserRoleProfile.SellerRole(s.bio(), s.sellingSince());
            case UserProfileResult.AdminProfileDetail ignored -> new UserRoleProfile.AdminRole();
            case UserProfileResult.CustomerProfileDetail ignored -> new UserRoleProfile.CustomerRole();
        };
    }
}