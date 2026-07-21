package com.equiplink.dto.response;

import java.util.List;

/**
 * Response payload representing equipment reviews stats summary and review entries.
 */
public record ReviewSummary(
        double averageRating,
        long totalReviews,
        List<ReviewResponse> reviews
) {}
