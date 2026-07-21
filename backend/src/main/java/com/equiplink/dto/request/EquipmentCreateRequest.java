package com.equiplink.dto.request;

import com.equiplink.entity.enums.EquipmentStatus;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * Request payload for creating new heavy machinery listings.
 */
public record EquipmentCreateRequest(
        @NotBlank(message = "Equipment name is required")
        @Size(max = 150, message = "Equipment name must not exceed 150 characters")
        String name,

        @NotBlank(message = "Brand is required")
        String brand,

        @NotBlank(message = "Model is required")
        String model,

        @NotNull(message = "Manufacture year is required")
        @Min(value = 1900, message = "Manufacture year must be at least 1900")
        @Max(value = 2100, message = "Manufacture year cannot exceed 2100")
        Integer manufactureYear,

        @NotNull(message = "Category identifier is required")
        Long categoryId,

        @NotBlank(message = "Description is required")
        @Size(max = 2000, message = "Description must not exceed 2000 characters")
        String description,

        @NotNull(message = "Daily rental price is required")
        @Positive(message = "Daily rental price must be positive")
        BigDecimal dailyRentalPrice,

        @NotBlank(message = "Location address is required")
        String location,

        @NotNull(message = "Availability status is required")
        EquipmentStatus availabilityStatus,

        @NotEmpty(message = "At least one image is required")
        List<String> imageUrls
) {}
