package com.equiplink.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

/**
 * DTO record representing Wishlist entries.
 */
public record WishlistDTO(
        Long id,

        @NotNull(message = "Customer identifier is required")
        Long customerId,

        @NotNull(message = "Equipment identifier is required")
        Long equipmentId,

        LocalDateTime createdAt
) {}
