package com.equiplink.dto;

import com.equiplink.entity.enums.BookingStatus;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO record representing machinery rental Bookings.
 */
public record BookingDTO(
        Long id,

        @NotNull(message = "Equipment identifier is required")
        Long equipmentId,

        @NotNull(message = "Customer identifier is required")
        Long customerId,

        @NotNull(message = "Rental start date is required")
        @FutureOrPresent(message = "Rental start date must be in the present or future")
        LocalDate startDate,

        @NotNull(message = "Rental end date is required")
        LocalDate endDate,

        @NotNull(message = "Booking status is required")
        BookingStatus status,

        @Size(max = 1000, message = "Optional message must not exceed 1000 characters")
        String message,

        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
