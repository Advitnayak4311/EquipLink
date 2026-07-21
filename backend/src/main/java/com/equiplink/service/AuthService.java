package com.equiplink.service;

import com.equiplink.dto.request.LoginRequest;
import com.equiplink.dto.request.RegistrationRequest;
import com.equiplink.dto.request.RefreshTokenRequest;
import com.equiplink.dto.response.LoginResponse;
import com.equiplink.dto.response.RefreshTokenResponse;

/**
 * Service interface for handling registration, login, logout, and token refresh operations.
 */
public interface AuthService {

    LoginResponse register(RegistrationRequest request);

    LoginResponse login(LoginRequest request);

    RefreshTokenResponse refreshToken(RefreshTokenRequest request);

    void logout(String refreshToken);

    void forgotPassword(String email);

    void resetPassword(String token, String newPassword);

    void verifyEmail(String token);

    void resendVerificationEmail(String email);
}
