package com.equiplink.dto.response;

import com.equiplink.dto.CategoryDTO;
import com.equiplink.entity.enums.EquipmentStatus;
import com.equiplink.entity.enums.PowerType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Detailed payload representing full equipment details.
 */
public record EquipmentResponse(
        Long id,
        String name,
        String brand,
        String model,
        Integer manufactureYear,
        String description,
        BigDecimal dailyRentalPrice,
        String location,
        EquipmentStatus availabilityStatus,
        PowerType powerType,
        Double batteryCapacityKwh,
        String chargingType,
        Boolean evTermsAccepted,
        String inspectionVideoUrl,
        String rcDocNumber,
        String insuranceDocNumber,
        String fitnessDocNumber,
        String operatorLicenseNumber,
        UserResponse owner,
        CategoryDTO category,
        List<EquipmentImageResponse> images,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
