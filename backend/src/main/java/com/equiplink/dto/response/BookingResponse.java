package com.equiplink.dto.response;

import com.equiplink.entity.enums.BookingStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Detailed response payload representing a Booking.
 */
public record BookingResponse(
        Long id,
        EquipmentResponse equipment,
        UserResponse customer,
        LocalDate startDate,
        LocalDate endDate,
        BookingStatus status,
        String message,
        String siteAddress,
        String workPurpose,
        String contactPhone,
        String companyName,
        String gstin,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
