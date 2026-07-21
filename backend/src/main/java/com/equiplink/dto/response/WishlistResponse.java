package com.equiplink.dto.response;

import java.time.LocalDateTime;

/**
 * Response payload representing an item in the user's saved wishlist.
 */
public record WishlistResponse(
        Long id,
        Long equipmentId,
        String name,
        String categoryName,
        String location,
        double dailyRentalPrice,
        String availabilityStatus,
        String imageUrl,
        LocalDateTime createdAt
) {}
