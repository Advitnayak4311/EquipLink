package com.equiplink.dto.response;

import com.equiplink.entity.enums.BookingStatus;
import com.equiplink.entity.enums.VerificationStatus;

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
        String machineLocation,
        String customerName,
        String customerEmail,
        String customerLocation,
        LocalDate startDate,
        LocalDate endDate,
        BookingStatus status,
        VerificationStatus verificationStatus,
        String videoCallRoomId,
        String rcDocumentUrl,
        String insuranceDocumentUrl,
        String fitnessCertificateUrl,
        String operatorLicenseUrl,
        Double estimatedDistanceKm,
        Double mobilizationCost,
        String message,
        String siteAddress,
        String workPurpose,
        String contactPhone,
        String companyName,
        String gstin,
        LocalDateTime createdAt
) {}
