package com.equiplink.controller;

import com.equiplink.dto.BaseResponse;
import com.equiplink.dto.response.AdminDashboardResponse;
import com.equiplink.dto.response.CustomerDashboardResponse;
import com.equiplink.dto.response.OwnerDashboardResponse;
import com.equiplink.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller exposing endpoints for role-based dashboard metrics.
 */
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard Management", description = "Endpoints for retrieving role-specific statistics and analytics charts")
public class DashboardController {

    private final DashboardService dashboardService;

    @Operation(summary = "Get admin dashboard platform analytics")
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BaseResponse<AdminDashboardResponse>> getAdminDashboard() {
        AdminDashboardResponse response = dashboardService.getAdminDashboard();
        return ResponseEntity.ok(BaseResponse.success("Admin dashboard retrieved", response));
    }

    @Operation(summary = "Get owner fleet and bookings statistics")
    @GetMapping("/owner")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<BaseResponse<OwnerDashboardResponse>> getOwnerDashboard(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        OwnerDashboardResponse response = dashboardService.getOwnerDashboard(userDetails.getUsername());
        return ResponseEntity.ok(BaseResponse.success("Owner dashboard retrieved", response));
    }

    @Operation(summary = "Get customer rental request history and wishlist stats")
    @GetMapping("/customer")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<BaseResponse<CustomerDashboardResponse>> getCustomerDashboard(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        CustomerDashboardResponse response = dashboardService.getCustomerDashboard(userDetails.getUsername());
        return ResponseEntity.ok(BaseResponse.success("Customer dashboard retrieved", response));
    }
}
