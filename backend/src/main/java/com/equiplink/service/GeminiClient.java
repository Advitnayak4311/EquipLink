package com.equiplink.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

/**
 * Service client communicating with Google Gemini AI API via Spring RestTemplate.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class GeminiClient {

    @Value("${app.gemini.base-url}")
    private String baseUrl;

    @Value("${app.gemini.api-key:}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public boolean hasApiKey() {
        return apiKey != null && !apiKey.trim().isEmpty();
    }

    public String generateContent(String prompt) {
        if (!hasApiKey()) {
            throw new IllegalStateException("Google Gemini API Key is not configured. Please set the GEMINI_API_KEY environment variable.");
        }

        String url = baseUrl + "/models/gemini-1.5-flash:generateContent?key=" + apiKey;

        // Construct Gemini JSON structure using native maps
        Map<String, Object> textPart = Map.of("text", prompt);
        Map<String, Object> content = Map.of("parts", List.of(textPart));
        Map<String, Object> requestBody = Map.of("contents", List.of(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            log.info("Sending generation request to Gemini API...");
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            Map<?, ?> body = response.getBody();

            if (body == null) {
                throw new IllegalStateException("Received empty response from Gemini API");
            }

            List<?> candidates = (List<?>) body.get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                throw new IllegalStateException("No candidates returned from Gemini API");
            }

            Map<?, ?> candidate = (Map<?, ?>) candidates.get(0);
            Map<?, ?> responseContent = (Map<?, ?>) candidate.get("content");
            List<?> parts = (List<?>) responseContent.get("parts");
            Map<?, ?> part = (Map<?, ?>) parts.get(0);
            String text = (String) part.get("text");

            if (text == null) {
                throw new IllegalStateException("Generated content text is null");
            }

            return cleanJsonText(text);

        } catch (Exception e) {
            log.error("Gemini API invocation failed: {}", e.getMessage());
            throw new RuntimeException("Unable to contact AI service. Please try again later. Details: " + e.getMessage(), e);
        }
    }

    private String cleanJsonText(String text) {
        String cleaned = text.trim();
        if (cleaned.startsWith("```json")) {
            cleaned = cleaned.substring(7);
        } else if (cleaned.startsWith("```")) {
            cleaned = cleaned.substring(3);
        }

        if (cleaned.endsWith("```")) {
            cleaned = cleaned.substring(0, cleaned.length() - 3);
        }

        return cleaned.trim();
    }
}
