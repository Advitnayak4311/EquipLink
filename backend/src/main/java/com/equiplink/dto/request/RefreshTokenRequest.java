package com.equiplink.dto.request;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO record for token refresh request.
 */
public record RefreshTokenRequest(
        @NotBlank(message = "Refresh token is required")
        String refreshToken
) {}
