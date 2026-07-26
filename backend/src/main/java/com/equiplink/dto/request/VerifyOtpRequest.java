package com.equiplink.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Request payload for verifying a 6-digit Email OTP code.
 */
public record VerifyOtpRequest(
        @NotBlank(message = "Email address is required")
        @Email(message = "Invalid email format")
        String email,

        @NotBlank(message = "OTP code is required")
        String otp
) {}
