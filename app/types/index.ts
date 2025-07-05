// User Types
export interface User {
  id: string;
  telegram_id: string;
  username: string;
  first_name: string;
  last_name: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface TelegramAuthRequest {
  telegram_id: string;
  username: string;
  first_name: string;
  last_name: string;
  auth_date: string;
  hash: string;
}

export interface AuthResponse {
  message: string;
  status: number;
  user: User;
  token: string;
}

// Product Types
export type ProductType = 'stars' | 'premium' | 'username' | 'number';

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  price: number;
  value?: number;
  extra_data?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface ProductResponse {
  message: string;
  status: number;
  product: Product | Product[];
}

// Order Types
export interface Order {
  id: string;
  user_id: string;
  product_id: string;
  amount: number;
  status: number; // 0 = Pending, 1 = Completed
  transaction_id: string;
  product?: {
    name: string;
    type: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface OrderRequest {
  user_id: string;
  product_id: string;
  amount: number;
  transaction_id: string;
}

export interface OrderResponse {
  message: string;
  status: string | number;
  order: Order | Order[];
  transaction_status?: boolean;
}

// Admin Types
export interface Admin {
  id: number;
  email: string;
  name: string;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminResponse {
  message: string;
  token?: string;
  admin: Admin;
}

// Pagination Types
export interface PaginatedResponse<T> {
  message: string;
  status: number;
  data: {
    current_page: number;
    data: T[];
    total: number;
    per_page: number;
    last_page: number;
  };
}


// Error Types
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  error?: string;
}