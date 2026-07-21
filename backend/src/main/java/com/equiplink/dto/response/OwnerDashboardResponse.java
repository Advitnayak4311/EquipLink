package com.equiplink.dto.response;

import java.util.List;
import java.util.Map;

/**
 * Response payload representing equipment owner dashboard statistics.
 */
public record OwnerDashboardResponse(
        long totalEquipment,
        long availableEquipment,
        long bookedEquipment,
        long pendingBookings,
        List<EquipmentSummaryResponse> recentEquipment,
        List<BookingSummaryResponse> recentBookings,
        Map<String, Long> bookingsPerMonth
) {}
