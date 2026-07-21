package com.equiplink.controller;

import com.equiplink.dto.BaseResponse;
import com.equiplink.dto.request.DescriptionGenerationRequest;
import com.equiplink.dto.request.ListingAnalysisRequest;
import com.equiplink.dto.response.DescriptionGenerationResponse;
import com.equiplink.dto.response.ListingAnalysisResponse;
import com.equiplink.service.AIService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller exposing endpoints for AI listing enhancements.
 */
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "AI Operations Assistance", description = "Endpoints for generating descriptions and analyzing heavy equipment listing quality")
public class AIController {

    private final AIService aiService;

    @Operation(summary = "Generate professional details description for a heavy machinery listing")
    @PostMapping("/generate-description")
    public ResponseEntity<BaseResponse<DescriptionGenerationResponse>> generateDescription(
            @Valid @RequestBody DescriptionGenerationRequest request
    ) {
        DescriptionGenerationResponse response = aiService.generateDescription(request);
        return ResponseEntity.ok(BaseResponse.success("Description generated successfully", response));
    }

    @Operation(summary = "Perform listing completeness and visual quality auditing analysis")
    @PostMapping("/analyze-listing")
    public ResponseEntity<BaseResponse<ListingAnalysisResponse>> analyzeListing(
            @Valid @RequestBody ListingAnalysisRequest request
    ) {
        ListingAnalysisResponse response = aiService.analyzeListing(request);
        return ResponseEntity.ok(BaseResponse.success("Analysis complete", response));
    }
}
