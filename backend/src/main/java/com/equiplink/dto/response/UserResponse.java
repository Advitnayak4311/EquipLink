package com.equiplink.dto.response;

import com.equiplink.entity.enums.UserRole;
import java.time.LocalDateTime;

/**
 * Response DTO representing the authenticated user's profile.
 */
public record UserResponse(
        Long id,
        String firstName,
        String lastName,
        String email,
        UserRole role,
        String phone,
        Boolean enabled,
        Boolean emailVerified,
        String companyName,
        String gstin,
        String businessType,
        String companyAddress,
        String city,
        String state,
        String pincode,
        LocalDateTime createdAt
) {}
