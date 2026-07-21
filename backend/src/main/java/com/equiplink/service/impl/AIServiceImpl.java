package com.equiplink.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.equiplink.dto.request.DescriptionGenerationRequest;
import com.equiplink.dto.request.ListingAnalysisRequest;
import com.equiplink.dto.response.DescriptionGenerationResponse;
import com.equiplink.dto.response.ListingAnalysisResponse;
import com.equiplink.service.AIService;
import com.equiplink.service.GeminiClient;
import com.equiplink.service.PromptBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Service implementation managing AI prompting, external calls, and JSON deserialization
 * with robust local fallback mechanisms for seamless demo and operational resilience.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AIServiceImpl implements AIService {

    private final GeminiClient geminiClient;
    private final PromptBuilder promptBuilder;
    private final ObjectMapper objectMapper;

    @Override
    public DescriptionGenerationResponse generateDescription(DescriptionGenerationRequest request) {
        if (geminiClient.hasApiKey()) {
            try {
                String prompt = promptBuilder.buildDescriptionPrompt(request);
                String rawJson = geminiClient.generateContent(prompt);
                log.info("Parsing AI description response to DescriptionGenerationResponse...");
                return objectMapper.readValue(rawJson, DescriptionGenerationResponse.class);
            } catch (Exception e) {
                log.warn("Gemini API call or mapping failed, using intelligent fallback generator: {}", e.getMessage());
            }
        } else {
            log.info("Gemini API key is not configured. Utilizing local intelligent description generator.");
        }

        return generateFallbackDescription(request);
    }

    @Override
    public ListingAnalysisResponse analyzeListing(ListingAnalysisRequest request) {
        if (geminiClient.hasApiKey()) {
            try {
                String prompt = promptBuilder.buildAnalysisPrompt(request);
                String rawJson = geminiClient.generateContent(prompt);
                log.info("Parsing AI listing analysis response to ListingAnalysisResponse...");
                return objectMapper.readValue(rawJson, ListingAnalysisResponse.class);
            } catch (Exception e) {
                log.warn("Gemini API call or mapping failed, using intelligent fallback listing analyzer: {}", e.getMessage());
            }
        } else {
            log.info("Gemini API key is not configured. Utilizing local intelligent listing analyzer.");
        }

        return generateFallbackAnalysis(request);
    }

    private DescriptionGenerationResponse generateFallbackDescription(DescriptionGenerationRequest request) {
        String brand = request.brand() != null ? request.brand() : "Industrial";
        String model = request.model() != null ? request.model() : "Standard";
        String name = request.name() != null ? request.name() : "Machinery";
        String category = request.category() != null ? request.category() : "Heavy Equipment";
        int year = request.manufactureYear() > 0 ? request.manufactureYear() : 2023;
        String location = request.location() != null && !request.location().isBlank() ? request.location() : "pan-India sites";

        String title = String.format("Premium %s %s %s (%d)", brand, model, name, year);

        String description = String.format(
                "High-performance %s %s %s (%d model) engineered for heavy-duty operational efficiency across %s. " +
                "Maintained to strict OEM enterprise standards with documented maintenance logs. Ideal for contractors seeking reliable, high-uptime %s machinery.",
                brand, model, name, year, location, category.toLowerCase()
        );

        String keyFeatures = String.format(
                "• Advanced hydraulic & powertrain systems for optimal fuel efficiency\n" +
                "• Ergonomic cabin equipped with operator comfort & safety controls\n" +
                "• Year of manufacture: %d with regular maintenance logs\n" +
                "• Daily rental pricing starting at ₹%.0f/day",
                year, request.dailyRentalPrice()
        );

        String recommendedUsage = String.format(
                "• Primary application: %s tasks, earthmoving, infrastructure development, and heavy site operations\n" +
                "• Suitable for demanding operational environments and extended multi-shift projects",
                category
        );

        String safetyNotes =
                "• Operating personnel must possess valid heavy machinery licenses and safety certifications\n" +
                "• Mandatory pre-start daily safety audit checklist required prior to key ignition";

        return new DescriptionGenerationResponse(title, description, keyFeatures, recommendedUsage, safetyNotes);
    }

    private ListingAnalysisResponse generateFallbackAnalysis(ListingAnalysisRequest request) {
        int score = 50;
        List<String> strengths = new ArrayList<>();
        List<String> weaknesses = new ArrayList<>();
        List<String> suggestions = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        if (request.name() != null && !request.name().isBlank()) {
            score += 10;
            strengths.add("Clear equipment title provided (" + request.name() + ").");
        } else {
            missing.add("Machinery Name");
        }

        if (request.category() != null && !request.category().isBlank()) {
            score += 10;
            strengths.add("Appropriate equipment categorization specified.");
        } else {
            missing.add("Category selection");
        }

        double priceVal = request.price() != null ? request.price() : 0.0;
        int imgCountVal = request.imagesCount() != null ? request.imagesCount() : 0;

        if (priceVal > 0) {
            score += 10;
            strengths.add("Competitive daily rental price set (₹" + (int) priceVal + "/day).");
        } else {
            weaknesses.add("Daily rental rate is not specified or set to 0.");
            suggestions.add("Set a realistic daily rental price based on market rates.");
        }

        if (imgCountVal > 0) {
            score += 10 + Math.min(imgCountVal * 5, 10);
            strengths.add("Attached " + imgCountVal + " image asset(s) showcasing machinery condition.");
        } else {
            score -= 15;
            weaknesses.add("Zero images uploaded for this machinery listing.");
            suggestions.add("Upload at least 2 clear images (front view and operational angle) to boost lessee inquiry rate by 40%.");
        }

        if (request.description() != null && request.description().length() > 30) {
            score += 10;
            strengths.add("Detailed operational description provided.");
        } else {
            weaknesses.add("Description is brief or missing attachment specifications.");
            suggestions.add("Use the 'Generate with AI' button to automatically produce comprehensive technical specifications.");
        }

        if (request.location() != null && !request.location().isBlank()) {
            score += 5;
            strengths.add("Location details specified (" + request.location() + ").");
        } else {
            missing.add("Machine physical location");
            suggestions.add("Specify city or district location to improve local search visibility.");
        }

        int finalScore = Math.min(Math.max(score, 30), 98);

        String improvedDescription = String.format(
                "Verified %s available for lease in %s. Daily rental rate: ₹%.0f. " +
                "Unit is fully serviced, operational, and ready for immediate deployment.",
                request.name() != null ? request.name() : "Machinery",
                request.location() != null ? request.location() : "specified location",
                priceVal
        );

        return new ListingAnalysisResponse(
                finalScore,
                strengths,
                weaknesses,
                suggestions,
                missing,
                improvedDescription
        );
    }
}
