import apiClient from "@/lib/api-client";
import {
  BaseResponse,
  LoginRequest,
  LoginResponse,
  RegistrationRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
  User,
} from "@/types";

/**
 * Authentication and User API client methods.
 */
export const authApi = {
  /**
   * Register a new user account.
   */
  register: async (data: RegistrationRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<BaseResponse<LoginResponse>>("/auth/register", data);
    return response.data.data;
  },

  /**
   * Login with email and password.
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<BaseResponse<LoginResponse>>("/auth/login", data);
    return response.data.data;
  },

  /**
   * Logout and clear the cookies.
   */
  logout: async (): Promise<void> => {
    await apiClient.post<BaseResponse<void>>("/auth/logout");
  },

  /**
   * Get the currently authenticated user's profile.
   */
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await apiClient.get<BaseResponse<User>>("/users/me");
      return response.data.data;
    } catch {
      return null;
    }
  },

  /**
   * Update the user profile.
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    const response = await apiClient.put<BaseResponse<User>>("/users/profile", data);
    return response.data.data;
  },

  /**
   * Change the user password.
   */
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await apiClient.put<BaseResponse<void>>("/users/change-password", data);
  },
};
