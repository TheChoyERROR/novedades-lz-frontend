import apiClient from '@/lib/api/client';
import {
  Product,
  ProductCreateRequest,
  ProductUpdateRequest,
  PageResponse,
  ProductFilterParams,
  ProductSearchParams,
  ApiResponse,
} from '@/types';
import { AxiosResponse } from 'axios';

class ProductService {
  private readonly BASE_URL = '/products';

  /**
   * Get all products with pagination
   */
  async getAllProducts(params?: {
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<PageResponse<Product>> {
    const response: AxiosResponse<ApiResponse<PageResponse<Product>>> = await apiClient.get(
      this.BASE_URL,
      { params }
    );
    return response.data.data;
  }

  /**
   * Get product by ID
   */
  async getProductById(id: number): Promise<Product> {
    const response: AxiosResponse<ApiResponse<Product>> = await apiClient.get(
      `${this.BASE_URL}/${id}`
    );
    return response.data.data;
  }

  /**
   * Search products by name or description
   */
  async searchProducts(params: ProductSearchParams): Promise<PageResponse<Product>> {
    const response: AxiosResponse<ApiResponse<PageResponse<Product>>> = await apiClient.get(
      `${this.BASE_URL}/search`,
      { params }
    );
    return response.data.data;
  }

  /**
   * Filter products by criteria
   */
  async filterProducts(params: ProductFilterParams): Promise<PageResponse<Product>> {
    const response: AxiosResponse<ApiResponse<PageResponse<Product>>> = await apiClient.get(
      `${this.BASE_URL}/filter`,
      { params }
    );
    return response.data.data;
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(
    category: string,
    params?: { page?: number; size?: number; sort?: string }
  ): Promise<PageResponse<Product>> {
    const response: AxiosResponse<ApiResponse<PageResponse<Product>>> = await apiClient.get(
      `${this.BASE_URL}/category/${category}`,
      { params }
    );
    return response.data.data;
  }

  /**
   * Create new product (ADMIN only)
   */
  async createProduct(product: ProductCreateRequest): Promise<Product> {
    const response: AxiosResponse<ApiResponse<Product>> = await apiClient.post(
      this.BASE_URL,
      product
    );
    return response.data.data;
  }

  /**
   * Update product (ADMIN only)
   */
  async updateProduct(id: number, product: ProductUpdateRequest): Promise<Product> {
    const response: AxiosResponse<ApiResponse<Product>> = await apiClient.put(
      `${this.BASE_URL}/${id}`,
      product
    );
    return response.data.data;
  }

  /**
   * Delete product (ADMIN only)
   */
  async deleteProduct(id: number): Promise<void> {
    await apiClient.delete(`${this.BASE_URL}/${id}`);
  }

  /**
   * Get all unique categories
   */
  async getCategories(): Promise<string[]> {
    try {
      const response: AxiosResponse<ApiResponse<string[]>> = await apiClient.get(
        `${this.BASE_URL}/categories`
      );
      return response.data.data;
    } catch {
      // Fallback: extract categories from products
      const products = await this.getAllProducts({ size: 100 });
      const categories = [...new Set(products.content.map(p => p.category))];
      return categories.sort();
    }
  }
}

export const productService = new ProductService();
