// ==================== ENUMS ====================

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

// ==================== USER TYPES ====================

export interface User {
  id: number;
  username?: string;
  email: string;
  fullName: string;
  phone?: string | null;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  fullName: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    type: string;
    expiresIn: number;
    user: User;
  };
}

// ==================== PRODUCT TYPES ====================

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string | null;
  active: boolean;
  lowStock: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ProductCreateRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  // imageUrl removed - now handled via multipart/form-data with File upload
}

export interface ProductUpdateRequest {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
  // imageUrl removed - now handled via multipart/form-data with File upload
}

// ==================== ORDER TYPES ====================

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  customerCity: string;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentProof: string | null;
  operationNumber: string | null;
  whatsappSent: boolean;
  notes: string | null;
  items: OrderItem[];
  createdAt: string | null;
  updatedAt: string | null;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderCreateRequest {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  customerCity: string;
  paymentMethod: string;
  notes?: string;
  items: OrderItemRequest[];
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface OrderUpdateRequest {
  status: OrderStatus;
}

// ==================== PAGINATION ====================

export interface PageRequest {
  page?: number;
  size?: number;
  sort?: string;
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

// ==================== FILTER & SEARCH ====================

export interface ProductFilterParams extends PageRequest {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface ProductSearchParams extends PageRequest {
  query: string;
}

// ==================== CART TYPES (CLIENT-SIDE ONLY) ====================

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

// ==================== API RESPONSE TYPES ====================

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T;
}
