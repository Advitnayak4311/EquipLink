import apiClient from "@/lib/api-client";
import {
  BaseResponse,
  Equipment,
  EquipmentStatus,
  PageResponse,
  Category,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ---- Types matching DTOs ----

export interface EquipmentCreateRequest {
  name: string;
  brand: string;
  model: string;
  manufactureYear: number;
  categoryId: number;
  description: string;
  dailyRentalPrice: number;
  location: string;
  availabilityStatus: EquipmentStatus;
  imageUrls: string[];
}

export interface EquipmentUpdateRequest {
  name: string;
  brand: string;
  model: string;
  manufactureYear: number;
  categoryId: number;
  description: string;
  dailyRentalPrice: number;
  location: string;
  availabilityStatus: EquipmentStatus;
}

export interface EquipmentSummary {
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

export interface OwnerStats {
  total: number;
  available: number;
  booked: number;
}

// ---- API Operations ----

export const equipmentApi = {
  create: async (data: EquipmentCreateRequest): Promise<Equipment> => {
    const response = await apiClient.post<BaseResponse<Equipment>>("/equipment", data);
    return response.data.data;
  },

  getAll: async (params?: {
    search?: string;
    categoryId?: number | string;
    status?: EquipmentStatus;
    page?: number;
    size?: number;
  }): Promise<PageResponse<EquipmentSummary>> => {
    const response = await apiClient.get<BaseResponse<PageResponse<EquipmentSummary>>>(
      "/equipment",
      { params }
    );
    return response.data.data;
  },

  getDetails: async (id: number): Promise<Equipment> => {
    const response = await apiClient.get<BaseResponse<Equipment>>(`/equipment/${id}`);
    return response.data.data;
  },

  update: async (id: number, data: EquipmentUpdateRequest): Promise<Equipment> => {
    const response = await apiClient.put<BaseResponse<Equipment>>(`/equipment/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete<BaseResponse<void>>(`/equipment/${id}`);
  },

  getMyEquipment: async (params?: {
    search?: string;
    categoryId?: number | string;
    status?: EquipmentStatus;
    page?: number;
    size?: number;
  }): Promise<PageResponse<EquipmentSummary>> => {
    const response = await apiClient.get<BaseResponse<PageResponse<EquipmentSummary>>>(
      "/equipment/my",
      { params }
    );
    return response.data.data;
  },

  getMyStats: async (): Promise<OwnerStats> => {
    const response = await apiClient.get<BaseResponse<OwnerStats>>("/equipment/my/stats");
    return response.data.data;
  },

  uploadImage: async (id: number, file: File): Promise<{ id: number; imageUrl: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<BaseResponse<{ id: number; imageUrl: string }>>(
      `/equipment/${id}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  },

  uploadTempFile: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<BaseResponse<String>>(
      "/equipment/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data.toString();
  },

  deleteImage: async (imageId: number): Promise<void> => {
    await apiClient.delete<BaseResponse<void>>(`/equipment/images/${imageId}`);
  },
};

// ---- React Query Hooks ----

export function useEquipment(id: number) {
  return useQuery({
    queryKey: ["equipment", id],
    queryFn: () => equipmentApi.getDetails(id),
    enabled: !!id && !isNaN(id),
  });
}

export function useCreateEquipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: equipmentApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
    },
  });
}

export function useUpdateEquipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EquipmentUpdateRequest }) =>
      equipmentApi.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["equipment", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
    },
  });
}

export function useDeleteEquipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: equipmentApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
    },
  });
}

export function useMyEquipment(params?: {
  search?: string;
  categoryId?: number | string;
  status?: EquipmentStatus;
  page?: number;
  size?: number;
}) {
  return useQuery({
    queryKey: ["equipment", "my", params],
    queryFn: () => equipmentApi.getMyEquipment(params),
  });
}

export function useAllEquipment(params?: {
  search?: string;
  categoryId?: number | string;
  status?: EquipmentStatus;
  page?: number;
  size?: number;
}) {
  return useQuery({
    queryKey: ["equipment", "all", params],
    queryFn: () => equipmentApi.getAll(params),
  });
}

export function useMyStats() {
  return useQuery({
    queryKey: ["equipment", "my-stats"],
    queryFn: equipmentApi.getMyStats,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const response = await apiClient.get<BaseResponse<Category[]>>("/categories");
      return response.data.data;
    },
  });
}
