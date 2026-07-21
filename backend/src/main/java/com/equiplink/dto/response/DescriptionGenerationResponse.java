package com.equiplink.dto.response;

/**
 * Response DTO holding generated professional title, copy, features list, and safety notes.
 */
public record DescriptionGenerationResponse(
        String professionalTitle,
        String professionalDescription,
        String keyFeatures,
        String recommendedUsage,
        String safetyNotes
) {}
