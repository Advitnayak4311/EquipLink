package com.equiplink.dto.response;

import java.util.List;

/**
 * Response DTO holding AI analytics score, strengths, weaknesses, and optimization suggestions.
 */
public record ListingAnalysisResponse(
        int overallScore,
        List<String> strengths,
        List<String> weaknesses,
        List<String> suggestions,
        List<String> missingInformation,
        String improvedDescriptionSuggestion
) {}
