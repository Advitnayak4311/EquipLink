package com.equiplink.dto.response;

/**
 * Payload representing equipment image outputs.
 */
public record EquipmentImageResponse(
        Long id,
        String imageUrl,
        Integer displayOrder
) {}
