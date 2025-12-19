import apiClient from '@/lib/api/client';
import { Order, OrderCreateRequest, OrderUpdateRequest, PageResponse, ApiResponse } from '@/types';
import { AxiosResponse } from 'axios';

class OrderService {
  private readonly BASE_URL = '/orders';

  /**
   * Get all orders for current user
   */
  async getMyOrders(params?: {
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<PageResponse<Order>> {
    const response: AxiosResponse<ApiResponse<PageResponse<Order>>> = await apiClient.get(
      `${this.BASE_URL}/my-orders`,
      { params }
    );
    return response.data.data;
  }

  /**
   * Get all orders (ADMIN only)
   */
  async getAllOrders(params?: {
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<PageResponse<Order>> {
    const response: AxiosResponse<ApiResponse<PageResponse<Order>>> = await apiClient.get(
      this.BASE_URL,
      { params }
    );
    return response.data.data;
  }

  /**
   * Get order by ID
   */
  async getOrderById(id: number): Promise<Order> {
    const response: AxiosResponse<ApiResponse<Order>> = await apiClient.get(
      `${this.BASE_URL}/${id}`
    );
    return response.data.data;
  }

  /**
   * Get order by order number (for tracking)
   */
  async getOrderByNumber(orderNumber: string): Promise<Order> {
    const response: AxiosResponse<ApiResponse<Order>> = await apiClient.get(
      `${this.BASE_URL}/track/${orderNumber}`
    );
    return response.data.data;
  }

  /**
   * Create new order
   */
  async createOrder(order: OrderCreateRequest): Promise<Order> {
    const response: AxiosResponse<ApiResponse<Order>> = await apiClient.post(
      this.BASE_URL,
      order
    );
    return response.data.data;
  }

  /**
   * Update order status (ADMIN only)
   */
  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const response: AxiosResponse<ApiResponse<Order>> = await apiClient.patch(
      `${this.BASE_URL}/${id}/status`,
      { status }
    );
    return response.data.data;
  }

  /**
   * Cancel order
   */
  async cancelOrder(id: number): Promise<Order> {
    const response: AxiosResponse<ApiResponse<Order>> = await apiClient.patch(
      `${this.BASE_URL}/${id}/cancel`
    );
    return response.data.data;
  }
}

export const orderService = new OrderService();
