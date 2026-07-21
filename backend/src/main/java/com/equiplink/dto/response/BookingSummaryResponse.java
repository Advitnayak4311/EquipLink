package com.equiplink.dto.response;

import com.equiplink.entity.enums.BookingStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Summary DTO representing bookings in owner and customer listings.
 */
public record BookingSummaryResponse(
        Long id,
        Long equipmentId,
        String equipmentName,
        String equipmentImageUrl,
        String customerName,
        String customerEmail,
        LocalDate startDate,
        LocalDate endDate,
        BookingStatus status,
        String message,
        String siteAddress,
        String workPurpose,
        String contactPhone,
        String companyName,
        String gstin,
        LocalDateTime createdAt
) {}
