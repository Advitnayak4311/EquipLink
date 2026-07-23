// ============================================================
//  EquipLink – Shared TypeScript Types
//  Mirrors backend DTOs for type-safe API interactions.
// ============================================================

export type Role = "ADMIN" | "OWNER" | "CUSTOMER";

export type BookingStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED";

export type EquipmentStatus = "AVAILABLE" | "BOOKED" | "MAINTENANCE" | "UNAVAILABLE";

// ---- Base API Wrapper ----

export interface BaseResponse<T> {
  timestamp: string;
  status: number;
  message: string;
  data: T;
  errors?: Record<string, string>;
}

// ---- User & Session Types ----

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  phone: string;
  enabled: boolean;
  emailVerified: boolean;
  companyName?: string;
  gstin?: string;
  businessType?: string;
  companyAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
  createdAt: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// ---- Auth & Profile Requests ----

export interface RegistrationRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: Role;
  acceptTerms: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phone: string;
  companyName?: string;
  gstin?: string;
  businessType?: string;
  companyAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface BookingRequest {
  equipmentId: number;
  startDate: string;
  endDate: string;
  message?: string;
  siteAddress?: string;
  workPurpose?: string;
  contactPhone?: string;
  companyName?: string;
  gstin?: string;
}

export interface BookingResponse {
  id: number;
  equipment: Equipment;
  customer: User;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  message?: string;
  siteAddress?: string;
  workPurpose?: string;
  contactPhone?: string;
  companyName?: string;
  gstin?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ChangePasswordRequest {
  currentPassword: String;
  newPassword: String;
  confirmNewPassword: String;
}

// ---- Stubs ----

export interface Category {
  id: number;
  name: string;
  icon: string;
  description?: string;
}

export interface EquipmentImage {
  id: number;
  imageUrl: string;
  displayOrder: number;
}

export type PowerType = "DIESEL" | "ELECTRIC" | "HYBRID";

export interface Equipment {
  id: number;
  name: string;
  brand: string;
  model: string;
  manufactureYear: number;
  description: string;
  dailyRentalPrice: number;
  location: string;
  availabilityStatus: EquipmentStatus;
  powerType?: PowerType;
  batteryCapacityKwh?: number;
  chargingType?: string;
  evTermsAccepted?: boolean;
  images: EquipmentImage[];
  owner: User;
  category: Category;
  createdAt: string;
  updatedAt?: string;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  errors?: Record<string, string>;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
