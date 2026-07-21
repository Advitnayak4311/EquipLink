package com.equiplink.dto.response;

import java.util.List;
import java.util.Map;

/**
 * Response payload representing platform administrator dashboard statistics.
 */
public record AdminDashboardResponse(
        long totalUsers,
        long totalOwners,
        long totalCustomers,
        long totalEquipment,
        long availableEquipment,
        long bookedEquipment,
        long pendingBookings,
        List<UserResponse> recentUsers,
        List<EquipmentSummaryResponse> recentEquipment,
        List<BookingSummaryResponse> recentBookings,
        Map<String, Long> equipmentByCategory,
        Map<String, Long> bookingStatusCounts
) {}
