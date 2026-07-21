package com.equiplink.service;

import com.equiplink.dto.request.DescriptionGenerationRequest;
import com.equiplink.dto.request.ListingAnalysisRequest;
import com.equiplink.dto.response.DescriptionGenerationResponse;
import com.equiplink.dto.response.ListingAnalysisResponse;

/**
 * Service contract for equipment details generation and quality analysis using AI.
 */
public interface AIService {

    DescriptionGenerationResponse generateDescription(DescriptionGenerationRequest request);

    ListingAnalysisResponse analyzeListing(ListingAnalysisRequest request);
}
