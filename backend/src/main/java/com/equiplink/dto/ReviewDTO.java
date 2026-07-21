package com.equiplink.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

/**
 * DTO record representing customer Reviews and ratings.
 */
public record ReviewDTO(
        Long id,

        @NotNull(message = "Equipment identifier is required")
        Long equipmentId,

        @NotNull(message = "Customer identifier is required")
        Long customerId,

        @NotNull(message = "Rating score is required")
        @Min(value = 1, message = "Rating must be at least 1")
        @Max(value = 5, message = "Rating must not exceed 5")
        Integer rating,

        @NotBlank(message = "Comment is required")
        @Size(max = 1000, message = "Comment must not exceed 1000 characters")
        String comment,

        LocalDateTime createdAt
) {}
