package com.equiplink.service;

import com.equiplink.dto.request.DescriptionGenerationRequest;
import com.equiplink.dto.request.ListingAnalysisRequest;
import org.springframework.stereotype.Component;

/**
 * Utility helper to compile structured prompt instructions for Gemini.
 */
@Component
public class PromptBuilder {

    public String buildDescriptionPrompt(DescriptionGenerationRequest request) {
        return "You are an expert copywriter in the heavy construction machinery and industrial fleet leasing industry. " +
               "Generate professional listing details for the machinery listing specified below.\n\n" +
               "Name: " + request.name() + "\n" +
               "Brand: " + request.brand() + "\n" +
               "Model: " + request.model() + "\n" +
               "Category: " + request.category() + "\n" +
               "Manufacture Year: " + request.manufactureYear() + "\n" +
               "Daily Rental Price: " + request.dailyRentalPrice() + "\n" +
               "Location: " + request.location() + "\n" +
               "Keywords: " + (request.keywords() != null ? request.keywords() : "None") + "\n\n" +
               "Strict formatting instructions:\n" +
               "Respond ONLY with a valid JSON object matching the following structure. Do not include markdown code blocks, do not include \"```json\" prefix, do not include trailing comments. Output only raw, parsable JSON:\n" +
               "{\n" +
               "  \"professionalTitle\": \"A premium, highly engaging marketplace title incorporating the brand, model, and category\",\n" +
               "  \"professionalDescription\": \"A descriptive, professional paragraph explaining the machinery capabilities, condition, and value proposition using industry-standard construction terminology\",\n" +
               "  \"keyFeatures\": \"Bullet points highlighting core specifications, hydraulic capacity, power, or operational capabilities\",\n" +
               "  \"recommendedUsage\": \"Bullet points recommending optimal site applications (e.g. mining, grading, road building)\",\n" +
               "  \"safetyNotes\": \"Bullet points detailing critical operating safety rules or operator certifications requirements\"\n" +
               "}";
    }

    public String buildAnalysisPrompt(ListingAnalysisRequest request) {
        return "You are an expert quality auditor and copy editor for heavy machinery and industrial fleet marketplaces.\n" +
               "Evaluate the listing parameters specified below to compute an overall quality score (0 to 100) and identify optimization actions.\n\n" +
               "Name: " + request.name() + "\n" +
               "Description: " + request.description() + "\n" +
               "Images Count: " + request.imagesCount() + "\n" +
               "Price: " + request.price() + "\n" +
               "Location: " + request.location() + "\n" +
               "Category: " + request.category() + "\n\n" +
               "Evaluation Criteria:\n" +
               "- Description length & quality: Is it informative, well-formatted, and accurate?\n" +
               "- Visual assets: Zero images is a major penalty (score < 40). 1 image is average (score 60-70). More is premium.\n" +
               "- Price & Location realism: Is pricing and location details clearly present and reasonable?\n" +
               "- Categorization accuracy.\n\n" +
               "Strict formatting instructions:\n" +
               "Respond ONLY with a valid JSON object matching the following structure. Do not include markdown code blocks, do not include \"```json\" prefix, do not include trailing comments. Output only raw, parsable JSON:\n" +
               "{\n" +
               "  \"overallScore\": 85, \n" +
               "  \"strengths\": [\"Strength point 1\", \"Strength point 2\"],\n" +
               "  \"weaknesses\": [\"Weakness point 1\", \"Weakness point 2\"],\n" +
               "  \"suggestions\": [\"Improvement action 1\", \"Improvement action 2\"],\n" +
               "  \"missingInformation\": [\"Missing detail 1\", \"Missing detail 2\"],\n" +
               "  \"improvedDescriptionSuggestion\": \"An enhanced and fully-rewritten description proposal incorporating construction best practices\"\n" +
               "}";
    }
}
