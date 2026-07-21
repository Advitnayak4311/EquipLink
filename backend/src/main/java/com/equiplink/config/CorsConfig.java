package com.equiplink.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

/**
 * CORS configuration for the EquipLink REST API.
 *
 * <p>Allows requests from the configured frontend origin with credentials
 * (required for HttpOnly cookie-based JWT authentication).
 *
 * <p>In production: CORS_ALLOWED_ORIGIN = https://your-app.vercel.app
 */
@Configuration
public class CorsConfig {

    @Value("${app.cors.allowed-origin}")
    private String allowedOrigin;

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Allow the frontend origin (Vercel in prod, localhost in dev)
        config.setAllowedOrigins(List.of(allowedOrigin));

        // Required for HttpOnly cookies to be sent/received cross-origin
        config.setAllowCredentials(true);

        // Allowed HTTP methods
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        // Allowed headers
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "X-Requested-With"));

        // Expose these headers to the browser
        config.setExposedHeaders(List.of("Authorization"));

        // Cache preflight for 1 hour
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);

        return new CorsFilter(source);
    }
}
