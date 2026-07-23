package com.equiplink.service.impl;

import com.equiplink.dto.request.LoginRequest;
import com.equiplink.dto.request.RegistrationRequest;
import com.equiplink.dto.request.RefreshTokenRequest;
import com.equiplink.dto.response.LoginResponse;
import com.equiplink.dto.response.RefreshTokenResponse;
import com.equiplink.dto.response.UserResponse;
import com.equiplink.entity.RefreshToken;
import com.equiplink.entity.User;
import com.equiplink.exception.EmailAlreadyExistsException;
import com.equiplink.exception.ResourceNotFoundException;
import com.equiplink.mapper.UserMapper;
import com.equiplink.repository.RefreshTokenRepository;
import com.equiplink.repository.UserRepository;
import com.equiplink.security.JwtUtil;
import com.equiplink.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Service implementation for user authentication, registration, and session token renewal.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final UserMapper userMapper;
    private final com.equiplink.notification.EmailService emailService;

    @org.springframework.beans.factory.annotation.Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    private static final long REFRESH_TOKEN_VALIDITY_MS = 7 * 24 * 60 * 60 * 1000L; // 7 days

    @Override
    @Transactional
    public LoginResponse register(RegistrationRequest request) {
        if (!request.password().equals(request.confirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        String cleanEmail = request.email().trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(cleanEmail)) {
            throw new EmailAlreadyExistsException(cleanEmail);
        }

        String verificationToken = UUID.randomUUID().toString();
        User user = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(cleanEmail)
                .password(passwordEncoder.encode(request.password()))
                .role(request.role())
                .phone(request.phone())
                .enabled(true)
                .emailVerified(false)
                .verificationToken(verificationToken)
                .verificationTokenExpiry(LocalDateTime.now().plusDays(1))
                .build();

        userRepository.save(user);
        log.info("Successfully registered user and generated verification token: {}", user.getEmail());

        // Send email asynchronously/non-blocking
        try {
            String verifyLink = frontendUrl + "/verify-email?token=" + verificationToken;
            emailService.sendVerificationEmail(user, verifyLink);
        } catch (Exception e) {
            log.error("Failed to send verification email: {}", e.getMessage());
        }

        return createSessionResponse(user);
    }

    @Override
    @Transactional
    public LoginResponse login(LoginRequest request) {
        String cleanEmail = request.email().trim().toLowerCase();
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(cleanEmail, request.password())
        );

        User user = userRepository.findByEmailIgnoreCase(cleanEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Clean up old refresh tokens for this user
        refreshTokenRepository.deleteByUser(user);

        return createSessionResponse(user);
    }

    @Override
    @Transactional
    public RefreshTokenResponse refreshToken(RefreshTokenRequest request) {
        String tokenStr = request.refreshToken();
        RefreshToken refreshToken = refreshTokenRepository.findByToken(tokenStr)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));

        if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new IllegalArgumentException("Refresh token has expired. Please sign in again.");
        }

        User user = refreshToken.getUser();
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String newAccessToken = jwtUtil.generateToken(userDetails);

        // Rotate Refresh Token
        String newRefreshTokenStr = UUID.randomUUID().toString();
        refreshToken.setToken(newRefreshTokenStr);
        refreshToken.setExpiryDate(Instant.now().plusMillis(REFRESH_TOKEN_VALIDITY_MS));
        refreshTokenRepository.save(refreshToken);

        return new RefreshTokenResponse(newAccessToken, newRefreshTokenStr);
    }

    @Override
    @Transactional
    public void logout(String refreshTokenStr) {
        if (refreshTokenStr != null && !refreshTokenStr.isBlank()) {
            refreshTokenRepository.findByToken(refreshTokenStr)
                    .ifPresent(refreshTokenRepository::delete);
        }
    }

    @Override
    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User with email " + email + " not found"));

        String resetToken = UUID.randomUUID().toString();
        user.setResetPasswordToken(resetToken);
        user.setResetPasswordTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        log.info("Generated password reset token for user: {}", email);

        try {
            String resetLink = frontendUrl + "/reset-password?token=" + resetToken;
            emailService.sendForgotPasswordEmail(user, resetLink);
        } catch (Exception e) {
            log.error("Failed to send password reset email: {}", e.getMessage());
        }
    }

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetPasswordToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid password reset token"));

        if (user.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Password reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);
        userRepository.save(user);

        log.info("Password successfully reset for user: {}", user.getEmail());
    }

    @Override
    @Transactional
    public void verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email verification token"));

        if (user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Verification link has expired. Please request a new one.");
        }

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiry(null);
        userRepository.save(user);

        log.info("Email verified successfully for user: {}", user.getEmail());

        // Send welcome email upon successful verification
        try {
            emailService.sendWelcomeEmail(user);
        } catch (Exception e) {
            log.error("Failed to send welcome email: {}", e.getMessage());
        }
    }

    @Override
    @Transactional
    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getEmailVerified()) {
            throw new IllegalStateException("Email address is already verified.");
        }

        String verificationToken = UUID.randomUUID().toString();
        user.setVerificationToken(verificationToken);
        user.setVerificationTokenExpiry(LocalDateTime.now().plusDays(1));
        userRepository.save(user);

        log.info("Resending verification email to: {}", email);

        try {
            String verifyLink = frontendUrl + "/verify-email?token=" + verificationToken;
            emailService.sendVerificationEmail(user, verifyLink);
        } catch (Exception e) {
            log.error("Failed to resend verification email: {}", e.getMessage());
        }
    }

    private LoginResponse createSessionResponse(User user) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String accessToken = jwtUtil.generateToken(userDetails);

        // Generate database-backed refresh token
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(REFRESH_TOKEN_VALIDITY_MS))
                .build();

        refreshTokenRepository.save(refreshToken);

        UserResponse userResponse = userMapper.toResponse(user);
        return new LoginResponse(accessToken, refreshToken.getToken(), userResponse);
    }
}
