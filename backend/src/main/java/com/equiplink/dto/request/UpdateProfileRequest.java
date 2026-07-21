package com.equiplink.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO record for profile updates.
 */
public record UpdateProfileRequest(
        @NotBlank(message = "First name is required")
        @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
        String firstName,

        @NotBlank(message = "Last name is required")
        @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
        String lastName,

        @NotBlank(message = "Phone number is required")
        String phone,

        // Optional B2B fields
        String companyName,
        String gstin,
        String businessType,
        String companyAddress,
        String city,
        String state,
        String pincode
) {}
