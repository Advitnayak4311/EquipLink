package com.equiplink.service;

import com.equiplink.dto.response.AdminDashboardResponse;
import com.equiplink.dto.response.CustomerDashboardResponse;
import com.equiplink.dto.response.OwnerDashboardResponse;

/**
 * Service contract for generating analytics dashboards.
 */
public interface DashboardService {

    AdminDashboardResponse getAdminDashboard();

    OwnerDashboardResponse getOwnerDashboard(String ownerEmail);

    CustomerDashboardResponse getCustomerDashboard(String customerEmail);
}
