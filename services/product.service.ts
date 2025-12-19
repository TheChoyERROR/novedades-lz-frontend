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
   * Create new product with image (ADMIN only)
   * @param product - Product data without imageUrl
   * @param imageFile - Optional image file to upload
   */
  async createProduct(product: ProductCreateRequest, imageFile?: File): Promise<Product> {
    const formData = new FormData();

    // Append product data as JSON blob
    const productBlob = new Blob([JSON.stringify(product)], { type: 'application/json' });
    formData.append('product', productBlob);

    // Append image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }



    try {
      // Don't set Content-Type manually - Axios sets it automatically with boundary
      const response: AxiosResponse<ApiResponse<Product>> = await apiClient.post(
        this.BASE_URL,
        formData
      );
      console.log('✅ Product created successfully:', response.data.data);
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Error creating product:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
      }
      throw error;
    }
  }

  /**
   * Update product with optional new image (ADMIN only)
   * @param id - Product ID
   * @param product - Product data to update (without imageUrl)
   * @param imageFile - Optional new image file to upload
   */
  async updateProduct(id: number, product: ProductUpdateRequest, imageFile?: File): Promise<Product> {
    const formData = new FormData();

    // Append product data as JSON blob
    const productBlob = new Blob([JSON.stringify(product)], { type: 'application/json' });
    formData.append('product', productBlob);

    // Append image file if provided (replaces existing image)
    if (imageFile) {
      formData.append('image', imageFile);
    }



    try {
      // Don't set Content-Type manually - Axios sets it automatically with boundary
      const response: AxiosResponse<ApiResponse<Product>> = await apiClient.put(
        `${this.BASE_URL}/${id}`,
        formData
      );
      console.log('✅ Product updated successfully:', response.data.data);
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Error updating product:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
      }
      throw error;
    }
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
