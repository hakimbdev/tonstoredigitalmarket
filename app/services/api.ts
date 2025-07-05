import {
  User, TelegramAuthRequest, AuthResponse,
  Product, ProductType, ProductResponse,
  Order, OrderRequest, OrderResponse,
  Admin, AdminLoginRequest, AdminResponse,
  PaginatedResponse, ApiError
} from '@/types';

// IMPORTANT: Replace this with your actual API base URL
const BASE_URL = 'https://your-api-base-url.com/api';

// Helper for making API requests
async function apiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: any,
  token?: string
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData as ApiError;
  }

  return response.json();
}

export const api = {
  // === Auth Endpoints ===
  telegramLogin: (data: TelegramAuthRequest) =>
    apiRequest<AuthResponse>('/auth/telegram', 'POST', data),

  // === Product Endpoints ===
  getProducts: (token: string) =>
    apiRequest<ProductResponse>('/products', 'GET', null, token),

  createProduct: (productData: Omit<Product, 'id'>, token: string) =>
    apiRequest<ProductResponse>('/products', 'POST', productData, token),

  getProduct: (id: string, token: string) =>
    apiRequest<ProductResponse>(`/products/${id}`, 'GET', null, token),

  updateProduct: (id: string, productData: Partial<Product>, token: string) =>
    apiRequest<ProductResponse>(`/products/${id}`, 'PUT', productData, token),

  deleteProduct: (id: string, token: string) =>
    apiRequest<{ message: string }>(`/products/${id}`, 'DELETE', null, token),

  // === Order Endpoints ===
  getOrders: (token: string) =>
    apiRequest<OrderResponse>('/orders', 'GET', null, token),

  createOrder: (orderData: OrderRequest, token: string) =>
    apiRequest<OrderResponse>('/orders', 'POST', orderData, token),

  getOrder: (id: string, token: string) =>
    apiRequest<OrderResponse>(`/orders/${id}`, 'GET', null, token),

  updateOrder: (id: string, orderData: Partial<Order>, token: string) =>
    apiRequest<OrderResponse>(`/orders/${id}`, 'PUT', orderData, token),

  deleteOrder: (id: string, token: string) =>
    apiRequest<{ message: string, status: number }>(`/orders/${id}`, 'DELETE', null, token),
    
  // === Guest Controller Endpoints ===
  getProductsByType: (type: ProductType) =>
    apiRequest<PaginatedResponse<Product>>(`/products/${type}`, 'GET'),
    
  getGuestProduct: (id: string) =>
    apiRequest<ProductResponse>(`/products/${id}`, 'GET'),

  // === Admin Auth Endpoints ===
  adminLogin: (data: AdminLoginRequest) =>
    apiRequest<AdminResponse>('/admin/login', 'POST', data),

  adminLogout: (token: string) =>
    apiRequest<{ message: string, admin: Admin }>('/admin/logout', 'POST', null, token),

  getAdminUser: (token: string) =>
    apiRequest<AdminResponse>('/admin/user', 'GET', null, token),
};