// ============================================================
// SHARED TYPE DEFINITIONS
// ============================================================

export interface UserCredentials {
  username: string;
  password: string;
}

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageSrc?: string;
}

export type SortOption =
  | 'az'
  | 'za'
  | 'lohi'
  | 'hilo';

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

export interface OrderSummary {
  subtotal: number;
  tax: number;
  total: number;
  items: CartItem[];
}

// ---- Reqres API Types ----

export interface ReqresUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface ReqresListResponse<T> {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: T[];
  support?: {
    url: string;
    text: string;
  };
}

export interface ReqresSingleResponse<T> {
  data: T;
  support?: {
    url: string;
    text: string;
  };
}

export interface CreateUserPayload {
  name: string;
  job: string;
}

export interface CreateUserResponse {
  name: string;
  job: string;
  id: string;
  createdAt: string;
}

export interface UpdateUserPayload {
  name?: string;
  job?: string;
}

export interface UpdateUserResponse {
  name: string;
  job: string;
  updatedAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface ApiError {
  error: string;
}

// ---- Test Context Types ----

export interface TestUser {
  type: 'standard' | 'locked' | 'problem' | 'performance_glitch' | 'error' | 'visual';
  username: string;
  password: string;
}

export interface EnvironmentConfig {
  baseUrl: string;
  apiBaseUrl: string;
  users: Record<string, TestUser>;
  timeouts: {
    default: number;
    navigation: number;
    expect: number;
  };
}
