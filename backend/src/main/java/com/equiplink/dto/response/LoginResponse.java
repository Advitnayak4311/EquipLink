package com.equiplink.dto.response;

/**
 * DTO record for login response.
 */
public record LoginResponse(
        String accessToken,
        String refreshToken,
        UserResponse user
) {}
