package com.equiplink.service.impl;

import com.equiplink.dto.request.ReviewRequest;
import com.equiplink.dto.response.ReviewResponse;
import com.equiplink.dto.response.ReviewSummary;
import com.equiplink.entity.Equipment;
import com.equiplink.entity.Review;
import com.equiplink.entity.User;
import com.equiplink.entity.enums.UserRole;
import com.equiplink.exception.ResourceNotFoundException;
import com.equiplink.repository.BookingRepository;
import com.equiplink.repository.EquipmentRepository;
import com.equiplink.repository.ReviewRepository;
import com.equiplink.repository.UserRepository;
import com.equiplink.service.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for managing customer machinery listings reviews and ratings.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final EquipmentRepository equipmentRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    @Override
    @Transactional
    public ReviewResponse createReview(ReviewRequest request, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer account not found"));

        if (customer.getRole() != UserRole.CUSTOMER) {
            throw new AccessDeniedException("Only customers can submit reviews");
        }

        Equipment equipment = equipmentRepository.findById(request.equipmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Machinery listing not found"));

        // Validation: Booking eligibility
        if (!bookingRepository.hasApprovedOrCompletedBooking(customerEmail, request.equipmentId())) {
            throw new IllegalStateException("You must have an approved or completed rental booking to review this equipment");
        }

        // Validation: Duplicates check
        if (reviewRepository.existsByEquipmentIdAndCustomerId(request.equipmentId(), customer.getId())) {
            throw new IllegalStateException("You have already reviewed this equipment listing");
        }

        // Validation: Rating bounds
        if (request.rating() < 1 || request.rating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5 stars");
        }

        Review review = Review.builder()
                .customer(customer)
                .equipment(equipment)
                .rating(request.rating())
                .comment(request.comment() == null ? "" : request.comment().trim())
                .build();

        reviewRepository.save(review);
        log.info("Review created for equipment {} by customer {}", request.equipmentId(), customerEmail);

        return mapToResponse(review);
    }

    @Override
    @Transactional
    public ReviewResponse updateReview(Long id, ReviewRequest request, String customerEmail) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getCustomer().getEmail().equals(customerEmail)) {
            throw new AccessDeniedException("You are not authorized to update this review");
        }

        // Validation: Rating bounds
        if (request.rating() < 1 || request.rating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5 stars");
        }

        review.setRating(request.rating());
        review.setComment(request.comment() == null ? "" : request.comment().trim());
        reviewRepository.save(review);
        log.info("Review {} updated by customer {}", id, customerEmail);

        return mapToResponse(review);
    }

    @Override
    @Transactional
    public void deleteReview(Long id, String currentUserEmail) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User account not found"));

        // Author or Admin can delete
        if (user.getRole() != UserRole.ADMIN && !review.getCustomer().getEmail().equals(currentUserEmail)) {
            throw new AccessDeniedException("You are not authorized to delete this review");
        }

        reviewRepository.delete(review);
        log.info("Review {} deleted by user {}", id, currentUserEmail);
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewSummary getReviewsForEquipment(Long equipmentId) {
        if (!equipmentRepository.existsById(equipmentId)) {
            throw new ResourceNotFoundException("Machinery listing not found");
        }

        List<Review> reviews = reviewRepository.findByEquipmentId(equipmentId);

        double averageRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        // Round to 1 decimal place
        averageRating = Math.round(averageRating * 10.0) / 10.0;

        List<ReviewResponse> responses = reviews.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return new ReviewSummary(averageRating, reviews.size(), responses);
    }

    private ReviewResponse mapToResponse(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getEquipment().getId(),
                review.getCustomer().getId(),
                review.getCustomer().getFirstName() + " " + review.getCustomer().getLastName(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt(),
                review.getUpdatedAt()
        );
    }
}
