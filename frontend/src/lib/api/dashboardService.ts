import apiClient from "@/lib/api-client";
import { BaseResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { EquipmentSummary } from "./equipmentService";
import { BookingSummaryResponse } from "./bookingService";

// ---- Types matching Dashboard DTOs ----

export interface AdminDashboardResponse {
  totalUsers: number;
  totalOwners: number;
  totalCustomers: number;
  totalEquipment: number;
  availableEquipment: number;
  bookedEquipment: number;
  pendingBookings: number;
  recentUsers: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    phone: string;
    createdAt: string;
  }[];
  recentEquipment: EquipmentSummary[];
  recentBookings: BookingSummaryResponse[];
  equipmentByCategory: Record<string, number>;
  bookingStatusCounts: Record<string, number>;
}

export interface OwnerDashboardResponse {
  totalEquipment: number;
  availableEquipment: number;
  bookedEquipment: number;
  pendingBookings: number;
  recentEquipment: EquipmentSummary[];
  recentBookings: BookingSummaryResponse[];
  bookingsPerMonth: Record<string, number>;
}

export interface CustomerDashboardResponse {
  totalBookings: number;
  approvedBookings: number;
  pendingBookings: number;
  wishlistCount: number;
  recentBookings: BookingSummaryResponse[];
  recentWishlist: EquipmentSummary[];
}

// ---- API Actions ----

export const dashboardApi = {
  getAdmin: async (): Promise<AdminDashboardResponse> => {
    const response = await apiClient.get<BaseResponse<AdminDashboardResponse>>("/dashboard/admin");
    return response.data.data;
  },

  getOwner: async (): Promise<OwnerDashboardResponse> => {
    const response = await apiClient.get<BaseResponse<OwnerDashboardResponse>>("/dashboard/owner");
    return response.data.data;
  },

  getCustomer: async (): Promise<CustomerDashboardResponse> => {
    const response = await apiClient.get<BaseResponse<CustomerDashboardResponse>>("/dashboard/customer");
    return response.data.data;
  },
};

// ---- React Query Hooks ----

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["dashboard", "admin"],
    queryFn: dashboardApi.getAdmin,
  });
}

export function useOwnerDashboard() {
  return useQuery({
    queryKey: ["dashboard", "owner"],
    queryFn: dashboardApi.getOwner,
  });
}

export function useCustomerDashboard() {
  return useQuery({
    queryKey: ["dashboard", "customer"],
    queryFn: dashboardApi.getCustomer,
  });
}
