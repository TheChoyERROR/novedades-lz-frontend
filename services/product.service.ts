import apiClient from '@/lib/api/client';
import {
  ApiResponse,
  PageRequest,
  PageResponse,
  Product,
  ProductCreateRequest,
  ProductFilterParams,
  ProductSearchParams,
  ProductUpdateRequest,
} from '@/types';
import axios, { AxiosResponse } from 'axios';

type ProductQueryParams = PageRequest & {
  category?: string;
  search?: string;
  active?: boolean;
};

class ProductService {
  private readonly BASE_URL = '/products';

  private logRequestError(action: string, error: unknown) {
    console.error(`Error ${action}:`, error);

    if (axios.isAxiosError(error)) {
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
    }
  }

  async getAllProducts(params?: ProductQueryParams): Promise<PageResponse<Product>> {
    const response: AxiosResponse<ApiResponse<PageResponse<Product>>> = await apiClient.get(
      this.BASE_URL,
      { params }
    );
    return response.data.data;
  }

  async getProductById(id: number): Promise<Product> {
    const response: AxiosResponse<ApiResponse<Product>> = await apiClient.get(
      `${this.BASE_URL}/${id}`
    );
    return response.data.data;
  }

  async searchProducts(params: ProductSearchParams): Promise<PageResponse<Product>> {
    const response: AxiosResponse<ApiResponse<PageResponse<Product>>> = await apiClient.get(
      `${this.BASE_URL}/search`,
      { params }
    );
    return response.data.data;
  }

  async filterProducts(params: ProductFilterParams): Promise<PageResponse<Product>> {
    const response = await this.getAllProducts({
      category: params.category,
      active: params.inStock === false ? undefined : true,
      page: params.page,
      size: params.size,
      sortBy: params.sortBy,
      direction: params.direction,
    });

    const filteredContent = response.content.filter((product) => {
      if (params.minPrice !== undefined && product.price < params.minPrice) {
        return false;
      }

      if (params.maxPrice !== undefined && product.price > params.maxPrice) {
        return false;
      }

      if (params.inStock && product.trackInventory && product.stock <= 0) {
        return false;
      }

      return true;
    });

    return {
      ...response,
      content: filteredContent,
      totalElements: filteredContent.length,
      numberOfElements: filteredContent.length,
      totalPages: filteredContent.length === 0 ? 0 : 1,
    };
  }

  async getProductsByCategory(
    category: string,
    params?: ProductQueryParams
  ): Promise<PageResponse<Product>> {
    const response: AxiosResponse<ApiResponse<PageResponse<Product>>> = await apiClient.get(
      `${this.BASE_URL}/category/${category}`,
      { params }
    );
    return response.data.data;
  }

  async createProduct(
    product: ProductCreateRequest,
    imageFiles?: File[],
    videoFile?: File | null
  ): Promise<Product> {
    if (!imageFiles || imageFiles.length === 0) {
      throw new Error('Selecciona al menos una imagen para el producto');
    }

    const formData = new FormData();
    formData.append('product', JSON.stringify(product));
    imageFiles.forEach((imageFile) => {
      formData.append('images', imageFile);
    });
    if (videoFile) {
      formData.append('video', videoFile);
    }

    try {
      const response: AxiosResponse<ApiResponse<Product>> = await apiClient.post(
        this.BASE_URL,
        formData
      );
      return response.data.data;
    } catch (error: unknown) {
      this.logRequestError('creating product', error);
      throw error;
    }
  }

  async updateProduct(
    id: number,
    product: ProductUpdateRequest,
    imageFiles?: File[],
    videoFile?: File | null
  ): Promise<Product> {
    const formData = new FormData();
    formData.append('product', JSON.stringify(product));

    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((imageFile) => {
        formData.append('images', imageFile);
      });
    }
    if (videoFile) {
      formData.append('video', videoFile);
    }

    try {
      const response: AxiosResponse<ApiResponse<Product>> = await apiClient.put(
        `${this.BASE_URL}/${id}`,
        formData
      );
      return response.data.data;
    } catch (error: unknown) {
      this.logRequestError('updating product', error);
      throw error;
    }
  }

  async deleteProduct(id: number): Promise<void> {
    await apiClient.delete(`${this.BASE_URL}/${id}`);
  }

  async getCategories(): Promise<string[]> {
    const products = await this.getAllProducts({
      size: 100,
      sortBy: 'category',
      direction: 'ASC',
    });

    const categories = [...new Set(products.content.map((product) => product.category))];
    return categories.sort();
  }
}

export const productService = new ProductService();
