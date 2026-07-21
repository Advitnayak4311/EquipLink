import apiClient from "@/lib/api-client";
import { BaseResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";

export interface DescriptionGenerationRequest {
  name: string;
  brand: string;
  model: string;
  category: string;
  manufactureYear: number;
  dailyRentalPrice: number;
  location: string;
  keywords?: string;
}

export interface DescriptionGenerationResponse {
  professionalTitle: string;
  professionalDescription: string;
  keyFeatures: string;
  recommendedUsage: string;
  safetyNotes: string;
}

export interface ListingAnalysisRequest {
  name: string;
  description: string;
  imagesCount: number;
  price: number;
  location: string;
  category: string;
}

export interface ListingAnalysisResponse {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  missingInformation: string[];
  improvedDescriptionSuggestion: string;
}

export const aiApi = {
  generateDescription: async (data: DescriptionGenerationRequest): Promise<DescriptionGenerationResponse> => {
    const response = await apiClient.post<BaseResponse<DescriptionGenerationResponse>>("/ai/generate-description", data);
    return response.data.data;
  },

  analyzeListing: async (data: ListingAnalysisRequest): Promise<ListingAnalysisResponse> => {
    const response = await apiClient.post<BaseResponse<ListingAnalysisResponse>>("/ai/analyze-listing", data);
    return response.data.data;
  },
};

// ---- React Query Hooks ----

export function useGenerateDescription() {
  return useMutation({
    mutationFn: aiApi.generateDescription,
  });
}

export function useAnalyzeListing() {
  return useMutation({
    mutationFn: aiApi.analyzeListing,
  });
}
