package com.equiplink.dto.response;

import com.equiplink.entity.enums.EquipmentStatus;

import java.math.BigDecimal;
import java.util.List;

/**
 * Response payload representing equipment details in marketplace grids.
 */
public record MarketplaceEquipmentResponse(
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
        String categoryName
) {}
