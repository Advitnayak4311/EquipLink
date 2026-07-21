import apiClient from "@/lib/api-client";
import { BaseResponse } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface WishlistResponse {
  id: number;
  equipmentId: number;
  name: string;
  categoryName: string;
  location: string;
  dailyRentalPrice: number;
  availabilityStatus: string;
  imageUrl: string | null;
  createdAt: string;
}

export const wishlistApi = {
  add: async (equipmentId: number): Promise<WishlistResponse> => {
    const response = await apiClient.post<BaseResponse<WishlistResponse>>(`/wishlist/${equipmentId}`);
    return response.data.data;
  },

  remove: async (equipmentId: number): Promise<void> => {
    await apiClient.delete<BaseResponse<void>>(`/wishlist/${equipmentId}`);
  },

  get: async (): Promise<WishlistResponse[]> => {
    const response = await apiClient.get<BaseResponse<WishlistResponse[]>>("/wishlist");
    return response.data.data;
  },
};

// ---- React Query Hooks ----

export function useWishlist() {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistApi.get,
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: wishlistApi.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: wishlistApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
    },
  });
}
