package com.equiplink.dto.request;

/**
 * Request DTO containing listed machinery parameters for listing quality analysis.
 */
public record ListingAnalysisRequest(
        String name,
        String description,
        Integer imagesCount,
        Double price,
        String location,
        String category
) {}
