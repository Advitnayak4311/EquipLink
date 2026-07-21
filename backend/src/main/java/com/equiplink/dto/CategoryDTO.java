package com.equiplink.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

/**
 * DTO record representing heavy machinery Category data.
 */
public record CategoryDTO(
        Long id,

        @NotBlank(message = "Category name is required")
        @Size(max = 100, message = "Category name must not exceed 100 characters")
        String name,

        @Size(max = 500, message = "Description must not exceed 500 characters")
        String description,

        @NotBlank(message = "Icon identifier is required")
        String icon,

        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
