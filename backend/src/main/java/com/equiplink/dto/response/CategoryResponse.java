package com.equiplink.dto.response;

/**
 * Response payload representing equipment categories.
 */
public record CategoryResponse(
        Long id,
        String name,
        String description,
        String icon
) {}
