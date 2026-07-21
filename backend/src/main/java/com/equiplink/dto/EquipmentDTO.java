package com.equiplink.dto;

import com.equiplink.entity.enums.EquipmentStatus;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO record representing heavy machinery Equipment data.
 */
public record EquipmentDTO(
        Long id,

        @NotBlank(message = "Equipment name is required")
        @Size(max = 150, message = "Equipment name must not exceed 150 characters")
        String name,

        @NotBlank(message = "Brand is required")
        String brand,

        @NotBlank(message = "Model is required")
        String model,

        @NotNull(message = "Manufacture year is required")
        @Min(value = 1900, message = "Manufacture year must be at least 1900")
        @Max(value = 2100, message = "Manufacture year is invalid")
        Integer manufactureYear,

        @NotBlank(message = "Description is required")
        @Size(max = 2000, message = "Description must not exceed 2000 characters")
        String description,

        @NotNull(message = "Daily rental price is required")
        @Positive(message = "Daily rental price must be a positive number")
        BigDecimal dailyRentalPrice,

        @NotBlank(message = "Location address is required")
        String location,

        @NotNull(message = "Availability status is required")
        EquipmentStatus availabilityStatus,

        @NotNull(message = "Owner identifier is required")
        Long ownerId,

        @NotNull(message = "Category identifier is required")
        Long categoryId,

        List<EquipmentImageDTO> images,

        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
