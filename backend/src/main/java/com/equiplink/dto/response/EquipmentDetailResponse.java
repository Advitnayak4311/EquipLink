package com.equiplink.dto.response;

import com.equiplink.entity.enums.EquipmentStatus;

import java.math.BigDecimal;
import java.util.List;

/**
 * Detailed response payload representing full details for a listing in the marketplace,
 * including lessor contact details.
 */
public record EquipmentDetailResponse(
        Long id,
        String name,
        String brand,
        String model,
        Integer manufactureYear,
        String description,
        BigDecimal dailyRentalPrice,
        String location,
        EquipmentStatus availabilityStatus,
        List<EquipmentImageResponse> images,
        String ownerName,
        String ownerEmail,
        String ownerPhone,
        String categoryName
) {}
