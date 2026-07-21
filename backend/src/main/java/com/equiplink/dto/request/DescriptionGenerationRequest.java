package com.equiplink.dto.request;

/**
 * Request DTO containing machinery listing parameters for AI description generation.
 */
public record DescriptionGenerationRequest(
        String name,
        String brand,
        String model,
        String category,
        Integer manufactureYear,
        Double dailyRentalPrice,
        String location,
        String keywords
) {}
