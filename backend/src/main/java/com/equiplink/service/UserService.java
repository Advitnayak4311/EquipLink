package com.equiplink.service;

import com.equiplink.dto.request.ChangePasswordRequest;
import com.equiplink.dto.request.UpdateProfileRequest;
import com.equiplink.dto.response.UserResponse;

/**
 * Service interface for managing user profiles and security credentials.
 */
public interface UserService {

    UserResponse getCurrentUserProfile(String email);

    UserResponse updateProfile(String email, UpdateProfileRequest request);

    void changePassword(String email, ChangePasswordRequest request);
}
