package com.equiplink.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/**
 * Request payload for creating a rental booking.
 */
public record BookingRequest(
        @NotNull(message = "Equipment identifier is required")
        Long equipmentId,

        @NotNull(message = "Rental start date is required")
        @FutureOrPresent(message = "Rental start date must be in the present or future")
        LocalDate startDate,

        @NotNull(message = "Rental end date is required")
        LocalDate endDate,

        @Size(max = 1000, message = "Optional message to owner must not exceed 1000 characters")
        String message,

        // Enhanced site & B2B fields
        String siteAddress,
        String workPurpose,
        String contactPhone,
        String companyName,
        String gstin
) {}
