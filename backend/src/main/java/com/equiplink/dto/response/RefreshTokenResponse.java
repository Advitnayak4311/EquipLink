package com.equiplink.dto.response;

/**
 * DTO record for refreshed access/refresh tokens.
 */
public record RefreshTokenResponse(
        String accessToken,
        String refreshToken
) {}
