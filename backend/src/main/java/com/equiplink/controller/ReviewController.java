package com.equiplink.controller;

import com.equiplink.dto.BaseResponse;
import com.equiplink.dto.request.ReviewRequest;
import com.equiplink.dto.response.ReviewResponse;
import com.equiplink.dto.response.ReviewSummary;
import com.equiplink.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * Controller exposing REST endpoints for equipment ratings and comments reviews.
 */
@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews Management", description = "Endpoints for submitting, updating, deleting and viewing equipment ratings reviews")
public class ReviewController {

    private final ReviewService reviewService;

    @Operation(summary = "Submit a rating review for equipment (Qualified Customers only)")
    @PostMapping
    public ResponseEntity<BaseResponse<ReviewResponse>> create(
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        ReviewResponse response = reviewService.createReview(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(BaseResponse.success("Review submitted successfully", response));
    }

    @Operation(summary = "Update an existing review (Author only)")
    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<ReviewResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        ReviewResponse response = reviewService.updateReview(id, request, userDetails.getUsername());
        return ResponseEntity.ok(BaseResponse.success("Review updated successfully", response));
    }

    @Operation(summary = "Delete a review (Author or Admin only)")
    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse<Void>> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        reviewService.deleteReview(id, userDetails.getUsername());
        return ResponseEntity.ok(BaseResponse.success("Review deleted successfully"));
    }

    @Operation(summary = "Get reviews list and statistics for a specific equipment listing")
    @GetMapping("/equipment/{equipmentId}")
    public ResponseEntity<BaseResponse<ReviewSummary>> getReviews(
            @PathVariable Long equipmentId
    ) {
        ReviewSummary response = reviewService.getReviewsForEquipment(equipmentId);
        return ResponseEntity.ok(BaseResponse.success("Equipment reviews retrieved successfully", response));
    }
}
