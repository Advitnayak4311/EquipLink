package com.equiplink.dto.response;

import java.time.LocalDateTime;

/**
 * Response payload representing a machinery review record.
 */
public record ReviewResponse(
        Long id,
        Long equipmentId,
        Long customerId,
        String customerName,
        Integer rating,
        String comment,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
