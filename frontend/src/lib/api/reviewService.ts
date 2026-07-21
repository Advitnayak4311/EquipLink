import apiClient from "@/lib/api-client";
import { BaseResponse } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface ReviewRequest {
  equipmentId: number;
  rating: number; // 1-5
  comment: string;
}

export interface ReviewResponse {
  id: number;
  equipmentId: number;
  customerId: number;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  reviews: ReviewResponse[];
}

export const reviewApi = {
  create: async (data: ReviewRequest): Promise<ReviewResponse> => {
    const response = await apiClient.post<BaseResponse<ReviewResponse>>("/reviews", data);
    return response.data.data;
  },

  update: async (params: { id: number; data: ReviewRequest }): Promise<ReviewResponse> => {
    const response = await apiClient.put<BaseResponse<ReviewResponse>>(`/reviews/${params.id}`, params.data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete<BaseResponse<void>>(`/reviews/${id}`);
  },

  getForEquipment: async (equipmentId: number): Promise<ReviewSummary> => {
    const response = await apiClient.get<BaseResponse<ReviewSummary>>(`/reviews/equipment/${equipmentId}`);
    return response.data.data;
  },
};

// ---- React Query Hooks ----

export function useEquipmentReviews(equipmentId: number) {
  return useQuery({
    queryKey: ["reviews", "equipment", equipmentId],
    queryFn: () => reviewApi.getForEquipment(equipmentId),
    enabled: !!equipmentId && !isNaN(equipmentId),
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", "equipment", data.equipmentId] });
      queryClient.invalidateQueries({ queryKey: ["equipment", data.equipmentId] });
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewApi.update,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", "equipment", data.equipmentId] });
    },
  });
}

export function useDeleteReview(equipmentId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", "equipment", equipmentId] });
      queryClient.invalidateQueries({ queryKey: ["equipment", equipmentId] });
    },
  });
}
