package com.equiplink.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

/**
 * DTO record representing equipment image details.
 */
public record EquipmentImageDTO(
        Long id,

        @NotBlank(message = "Image URL is required")
        String imageUrl,

        @NotNull(message = "Display order index is required")
        @PositiveOrZero(message = "Display order index must not be negative")
        Integer displayOrder
) {}
