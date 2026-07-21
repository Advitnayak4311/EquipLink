package com.equiplink.service;

import com.equiplink.dto.request.ReviewRequest;
import com.equiplink.dto.response.ReviewResponse;
import com.equiplink.dto.response.ReviewSummary;

/**
 * Service contract for equipment rating and review operations.
 */
public interface ReviewService {

    ReviewResponse createReview(ReviewRequest request, String customerEmail);

    ReviewResponse updateReview(Long id, ReviewRequest request, String customerEmail);

    void deleteReview(Long id, String currentUserEmail);

    ReviewSummary getReviewsForEquipment(Long equipmentId);
}
