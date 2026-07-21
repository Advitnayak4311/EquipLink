import apiClient from "@/lib/api-client";
import { BaseResponse, Category, EquipmentStatus, PageResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

// ---- Types matching Marketplace DTOs ----

export interface MarketplaceEquipmentResponse {
  id: number;
  name: string;
  brand: string;
  model: string;
  manufactureYear: number;
  description: string;
  dailyRentalPrice: number;
  location: string;
  availabilityStatus: EquipmentStatus;
  images: { id: number; imageUrl: string; displayOrder: number }[];
  ownerName: string;
  categoryName: string;
}

export interface EquipmentDetailResponse {
  id: number;
  name: string;
  brand: string;
  model: string;
  manufactureYear: number;
  description: string;
  dailyRentalPrice: number;
  location: string;
  availabilityStatus: EquipmentStatus;
  images: { id: number; imageUrl: string; displayOrder: number }[];
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  categoryName: string;
}

export interface CategoryResponse {
  id: number;
  name: string;
  description: string;
  icon: string;
}

export interface MarketplaceFilters {
  search?: string;
  category?: number | string;
  status?: EquipmentStatus;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  size?: number;
}

// ---- API Actions ----

export const marketplaceApi = {
  search: async (params?: MarketplaceFilters): Promise<PageResponse<MarketplaceEquipmentResponse>> => {
    const response = await apiClient.get<BaseResponse<PageResponse<MarketplaceEquipmentResponse>>>(
      "/marketplace",
      { params }
    );
    return response.data.data;
  },

  getDetails: async (id: number): Promise<EquipmentDetailResponse> => {
    const response = await apiClient.get<BaseResponse<EquipmentDetailResponse>>(`/marketplace/${id}`);
    return response.data.data;
  },

  getRelated: async (id: number): Promise<MarketplaceEquipmentResponse[]> => {
    const response = await apiClient.get<BaseResponse<MarketplaceEquipmentResponse[]>>(`/marketplace/${id}/related`);
    return response.data.data;
  },

  getCategories: async (): Promise<CategoryResponse[]> => {
    const response = await apiClient.get<BaseResponse<CategoryResponse[]>>("/marketplace/categories");
    return response.data.data;
  },
};

// ---- TanStack Query Hooks ----

export function useMarketplace(filters?: MarketplaceFilters) {
  return useQuery({
    queryKey: ["marketplace", "search", filters],
    queryFn: () => marketplaceApi.search(filters),
  });
}

export function useEquipmentDetails(id: number) {
  return useQuery({
    queryKey: ["marketplace", "details", id],
    queryFn: () => marketplaceApi.getDetails(id),
    enabled: !!id && !isNaN(id),
  });
}

export function useRelatedEquipment(id: number) {
  return useQuery({
    queryKey: ["marketplace", "related", id],
    queryFn: () => marketplaceApi.getRelated(id),
    enabled: !!id && !isNaN(id),
  });
}

export function useMarketplaceCategories() {
  return useQuery({
    queryKey: ["marketplace", "categories"],
    queryFn: marketplaceApi.getCategories,
  });
}
