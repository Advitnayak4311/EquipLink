package com.equiplink.dto.response;

/**
 * Authentication response DTO.
 * The JWT token is set in an HttpOnly cookie by the controller;
 * this response body carries the user profile and a success message.
 */
public record AuthResponse(
        String message,
        UserResponse user
) {}
