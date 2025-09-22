package com.donkie.quickcart.user.api.mapper;

import com.donkie.quickcart.user.api.dto.request.CreateUserProfileRequest;
import com.donkie.quickcart.user.api.dto.request.UpdateUserProfileRequest;
import com.donkie.quickcart.user.api.dto.request.UserRegistrationRequest;
import com.donkie.quickcart.user.api.dto.response.UserProfileResponse;
import com.donkie.quickcart.user.application.model.UserProfileCommand;
import com.donkie.quickcart.user.application.model.UserProfileResult;
import org.springframework.stereotype.Component;

/**
 * Mapper for converting between API DTOs and Application models.
 */
@Component
public class UserProfileApiMapper {

    /**
     * Maps API registration request to application command.
     */
    public UserProfileCommand.Register toRegisterCommand(UserRegistrationRequest request) {
        return new UserProfileCommand.Register(
                request.email(),
                request.password()
        );
    }

    /**
     * Maps API create request to application command.
     */
    public UserProfileCommand.Create toCreateCommand(CreateUserProfileRequest request) {
        return new UserProfileCommand.Create(
                request.firstName(),
                request.lastName(),
                request.phoneNumber(),
                request.dateOfBirth()
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
                result.dateOfBirth(),
                result.createdDate(),
                result.lastModifiedDate()
        );
    }
}