package com.donkie.quickcart.user.application.service;

import com.donkie.quickcart.user.application.model.SellerProfileCommand;
import com.donkie.quickcart.user.application.model.UserProfileCommand;
import com.donkie.quickcart.user.application.model.UserProfileResult;

public interface UserProfileService {

    void registerNewUser(UserProfileCommand.Register register);

    UserProfileResult.Detail updateUserProfile(UserProfileCommand.Update update);

    UserProfileResult.Detail getCurrentUserProfile();

    UserProfileResult.Detail createSellerProfile();

    UserProfileResult.Detail updateSellerProfile(SellerProfileCommand.Update update);

    void registerAdmin(UserProfileCommand.Register register);
}
