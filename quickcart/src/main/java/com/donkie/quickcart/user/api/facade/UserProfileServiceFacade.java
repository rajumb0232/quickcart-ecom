package com.donkie.quickcart.user.api.facade;

import com.donkie.quickcart.user.api.dto.request.SellerEditRequest;
import com.donkie.quickcart.user.api.dto.request.UpdateUserProfileRequest;
import com.donkie.quickcart.user.api.dto.request.UserCredentials;
import com.donkie.quickcart.user.api.dto.response.UserProfileResponse;
import com.donkie.quickcart.user.api.mapper.UserProfileApiMapper;
import com.donkie.quickcart.user.application.model.SellerProfileCommand;
import com.donkie.quickcart.user.application.model.UserProfileCommand;
import com.donkie.quickcart.user.application.model.UserProfileResult;
import com.donkie.quickcart.user.application.service.UserProfileService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserProfileServiceFacade {

    private final UserProfileService userProfileService;
    private final UserProfileApiMapper mapper;

    public void registerNewUser(UserCredentials request) {
        UserProfileCommand.Register command = mapper.toRegisterCommand(request);
        userProfileService.registerNewUser(command);
    }

    public UserProfileResponse updateProfile(UpdateUserProfileRequest request) {
        UserProfileCommand.Update command = mapper.toUpdateCommand(request);
        UserProfileResult.Detail result = userProfileService.updateUserProfile(command);
        return mapper.toResponse(result);
    }

    public UserProfileResponse getUserProfile() {
        UserProfileResult.Detail result = userProfileService.getCurrentUserProfile();
        return mapper.toResponse(result);
    }

    public UserProfileResponse createSellerProfile() {
        UserProfileResult.Detail detail = userProfileService.createSellerProfile();
        return mapper.toResponse(detail);
    }

    public UserProfileResponse updateSellerProfile(SellerEditRequest editRequest) {
        SellerProfileCommand.Update update = new SellerProfileCommand.Update(editRequest.bio());
        UserProfileResult.Detail detail = userProfileService.updateSellerProfile(update);
        return mapper.toResponse(detail);
    }
}
