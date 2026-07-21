package com.equiplink.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * Request payload for submitting or editing a machinery review.
 */
public record ReviewRequest(
        @NotNull(message = "Equipment ID is required")
        Long equipmentId,

        @NotNull(message = "Rating is required")
        @Min(value = 1, message = "Rating must be at least 1 star")
        @Max(value = 5, message = "Rating must not exceed 5 stars")
        Integer rating,

        String comment
) {}
