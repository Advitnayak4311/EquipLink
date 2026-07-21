import apiClient from "@/lib/api-client";
import { BaseResponse, BookingStatus, PageResponse } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ---- Types matching Booking DTOs ----

export interface BookingRequest {
  equipmentId: number;
  startDate: string; // ISO Date YYYY-MM-DD
  endDate: string; // ISO Date YYYY-MM-DD
  message?: string;
  siteAddress?: string;
  workPurpose?: string;
  contactPhone?: string;
  companyName?: string;
  gstin?: string;
}

export interface BookingSummaryResponse {
  id: number;
  equipmentId: number;
  equipmentName: string;
  equipmentImageUrl: string;
  customerName: string;
  customerEmail: string;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  message: string;
  siteAddress?: string;
  workPurpose?: string;
  contactPhone?: string;
  companyName?: string;
  gstin?: string;
  createdAt: string;
}

export interface BookingResponse {
  id: number;
  equipment: {
    id: number;
    name: string;
    dailyRentalPrice: number;
    location: string;
    ownerId: number;
  };
  customer: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    companyName?: string;
    gstin?: string;
  };
  startDate: string;
  endDate: string;
  status: BookingStatus;
  message: string;
  siteAddress?: string;
  workPurpose?: string;
  contactPhone?: string;
  companyName?: string;
  gstin?: string;
  createdAt: string;
  updatedAt: string;
}

// ---- API Actions ----

export const bookingApi = {
  create: async (data: BookingRequest): Promise<BookingResponse> => {
    const response = await apiClient.post<BaseResponse<BookingResponse>>("/bookings", data);
    return response.data.data;
  },

  getMyBookings: async (params?: { page?: number; size?: number }): Promise<PageResponse<BookingSummaryResponse>> => {
    const response = await apiClient.get<BaseResponse<PageResponse<BookingSummaryResponse>>>(
      "/bookings/my",
      { params }
    );
    return response.data.data;
  },

  getOwnerBookings: async (params?: {
    search?: string;
    status?: BookingStatus;
    page?: number;
    size?: number;
  }): Promise<PageResponse<BookingSummaryResponse>> => {
    const response = await apiClient.get<BaseResponse<PageResponse<BookingSummaryResponse>>>(
      "/bookings/owner",
      { params }
    );
    return response.data.data;
  },

  getDetails: async (id: number): Promise<BookingResponse> => {
    const response = await apiClient.get<BaseResponse<BookingResponse>>(`/bookings/${id}`);
    return response.data.data;
  },

  approve: async (id: number): Promise<BookingResponse> => {
    const response = await apiClient.put<BaseResponse<BookingResponse>>(`/bookings/${id}/approve`);
    return response.data.data;
  },

  reject: async (id: number): Promise<BookingResponse> => {
    const response = await apiClient.put<BaseResponse<BookingResponse>>(`/bookings/${id}/reject`);
    return response.data.data;
  },

  cancel: async (id: number): Promise<BookingResponse> => {
    const response = await apiClient.put<BaseResponse<BookingResponse>>(`/bookings/${id}/cancel`);
    return response.data.data;
  },
};

// ---- React Query Hooks ----

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookingApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useMyBookings(params?: { page?: number; size?: number }) {
  return useQuery({
    queryKey: ["bookings", "my", params],
    queryFn: () => bookingApi.getMyBookings(params),
  });
}

export function useOwnerBookings(params?: {
  search?: string;
  status?: BookingStatus;
  page?: number;
  size?: number;
}) {
  return useQuery({
    queryKey: ["bookings", "owner", params],
    queryFn: () => bookingApi.getOwnerBookings(params),
  });
}

export function useApproveBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookingApi.approve,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings", id] });
    },
  });
}

export function useRejectBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookingApi.reject,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings", id] });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookingApi.cancel,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings", id] });
    },
  });
}

export function useBookingDetails(id: number) {
  return useQuery({
    queryKey: ["bookings", "details", id],
    queryFn: () => bookingApi.getDetails(id),
    enabled: !!id && !isNaN(id),
  });
}
