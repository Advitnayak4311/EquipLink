package com.equiplink.dto.response;

import java.util.List;

/**
 * Response payload representing customer activity dashboard statistics.
 */
public record CustomerDashboardResponse(
        long totalBookings,
        long approvedBookings,
        long pendingBookings,
        long wishlistCount,
        List<BookingSummaryResponse> recentBookings,
        List<EquipmentSummaryResponse> recentWishlist
) {}
