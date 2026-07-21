package com.equiplink.controller;

import com.equiplink.dto.BaseResponse;
import com.equiplink.dto.request.LoginRequest;
import com.equiplink.dto.request.RegistrationRequest;
import com.equiplink.dto.request.RefreshTokenRequest;
import com.equiplink.dto.response.LoginResponse;
import com.equiplink.dto.response.RefreshTokenResponse;
import com.equiplink.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

/**
 * Controller handling public user authentication, registration, logout, and token refresh.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for registration, login, logout, and session refreshing")
public class AuthController {

    private final AuthService authService;

    @Value("${app.jwt.cookie-name}")
    private String authCookieName;

    @Value("${app.jwt.expiration-ms}")
    private long authCookieExpirationMs;

    private static final String REFRESH_COOKIE_NAME = "equiplink_refresh";
    private static final int REFRESH_COOKIE_EXPIRATION_SEC = 7 * 24 * 60 * 60; // 7 days

    @Operation(summary = "Register a new user account")
    @PostMapping("/register")
    public ResponseEntity<BaseResponse<LoginResponse>> register(
            @Valid @RequestBody RegistrationRequest request,
            HttpServletResponse response
    ) {
        LoginResponse loginResponse = authService.register(request);
        setCookies(response, loginResponse.accessToken(), loginResponse.refreshToken());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(BaseResponse.success("User registration successful", loginResponse));
    }

    @Operation(summary = "Login using email and password credentials")
    @PostMapping("/login")
    public ResponseEntity<BaseResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        LoginResponse loginResponse = authService.login(request);
        setCookies(response, loginResponse.accessToken(), loginResponse.refreshToken());
        return ResponseEntity.ok(BaseResponse.success("Login successful", loginResponse));
    }

    @Operation(summary = "Refresh access session using long-lived refresh token")
    @PostMapping("/refresh")
    public ResponseEntity<BaseResponse<RefreshTokenResponse>> refresh(
            @RequestBody(required = false) RefreshTokenRequest requestBody,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        String tokenStr = null;

        // Try extracting from request body first
        if (requestBody != null && requestBody.refreshToken() != null && !requestBody.refreshToken().isBlank()) {
            tokenStr = requestBody.refreshToken();
        }

        // Fallback to extracting from HttpOnly cookie
        if (tokenStr == null && request.getCookies() != null) {
            tokenStr = Arrays.stream(request.getCookies())
                    .filter(cookie -> REFRESH_COOKIE_NAME.equals(cookie.getName()))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElse(null);
        }

        if (tokenStr == null || tokenStr.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(BaseResponse.error(HttpStatus.BAD_REQUEST.value(), "Refresh token missing"));
        }

        RefreshTokenResponse tokenResponse = authService.refreshToken(new RefreshTokenRequest(tokenStr));
        setCookies(response, tokenResponse.accessToken(), tokenResponse.refreshToken());

        return ResponseEntity.ok(BaseResponse.success("Token refreshed successfully", tokenResponse));
    }

    @Operation(summary = "Logout user and invalidate refresh session")
    @PostMapping("/logout")
    public ResponseEntity<BaseResponse<Void>> logout(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        String tokenStr = null;
        if (request.getCookies() != null) {
            tokenStr = Arrays.stream(request.getCookies())
                    .filter(cookie -> REFRESH_COOKIE_NAME.equals(cookie.getName()))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElse(null);
        }

        authService.logout(tokenStr);
        clearCookies(response);

        return ResponseEntity.ok(BaseResponse.success("Logged out successfully"));
    }

    @Operation(summary = "Request password reset link by email")
    @PostMapping("/forgot-password")
    public ResponseEntity<BaseResponse<Void>> forgotPassword(@RequestParam String email) {
        authService.forgotPassword(email);
        return ResponseEntity.ok(BaseResponse.success("Password reset link sent to your email"));
    }

    @Operation(summary = "Reset password using token")
    @PostMapping("/reset-password")
    public ResponseEntity<BaseResponse<Void>> resetPassword(
            @RequestParam String token,
            @RequestParam String newPassword
    ) {
        authService.resetPassword(token, newPassword);
        return ResponseEntity.ok(BaseResponse.success("Password reset successfully"));
    }

    @Operation(summary = "Verify email address using token")
    @PostMapping("/verify-email")
    public ResponseEntity<BaseResponse<Void>> verifyEmail(@RequestParam String token) {
        authService.verifyEmail(token);
        return ResponseEntity.ok(BaseResponse.success("Email verified successfully"));
    }

    @Operation(summary = "Resend email verification link")
    @PostMapping("/resend-verification")
    public ResponseEntity<BaseResponse<Void>> resendVerification(@RequestParam String email) {
        authService.resendVerificationEmail(email);
        return ResponseEntity.ok(BaseResponse.success("Verification email resent successfully"));
    }

    private void setCookies(HttpServletResponse response, String accessToken, String refreshToken) {
        // Access Token Cookie
        response.addHeader("Set-Cookie",
                String.format("%s=%s; Max-Age=%d; Path=/; HttpOnly; Secure; SameSite=None",
                        authCookieName, accessToken, (int) (authCookieExpirationMs / 1000))
        );

        // Refresh Token Cookie
        response.addHeader("Set-Cookie",
                String.format("%s=%s; Max-Age=%d; Path=/; HttpOnly; Secure; SameSite=None",
                        REFRESH_COOKIE_NAME, refreshToken, REFRESH_COOKIE_EXPIRATION_SEC)
        );
    }

    private void clearCookies(HttpServletResponse response) {
        response.addHeader("Set-Cookie",
                String.format("%s=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=None", authCookieName)
        );
        response.addHeader("Set-Cookie",
                String.format("%s=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=None", REFRESH_COOKIE_NAME)
        );
    }
}
