import apiClient from '@/lib/api/client';
import { ApiResponse, Order, OrderCreateRequest, OrderStatus, PageResponse } from '@/types';
import { AxiosResponse } from 'axios';

interface OrderQueryParams {
  status?: OrderStatus;
  customerPhone?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'ASC' | 'DESC';
}

class OrderService {
  private readonly BASE_URL = '/orders';

  async getAllOrders(params?: OrderQueryParams): Promise<PageResponse<Order>> {
    const response: AxiosResponse<ApiResponse<PageResponse<Order>>> = await apiClient.get(
      this.BASE_URL,
      { params }
    );
    return response.data.data;
  }

  async getOrderById(id: number): Promise<Order> {
    const response: AxiosResponse<ApiResponse<Order>> = await apiClient.get(
      `${this.BASE_URL}/${id}`
    );
    return response.data.data;
  }

  async createOrder(order: OrderCreateRequest): Promise<Order> {
    const response: AxiosResponse<ApiResponse<Order>> = await apiClient.post(
      this.BASE_URL,
      order
    );
    return response.data.data;
  }

  async updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
    const response: AxiosResponse<ApiResponse<Order>> = await apiClient.put(
      `${this.BASE_URL}/${id}/status`,
      { status }
    );
    return response.data.data;
  }

  async uploadYapeProof(id: number, proof: File): Promise<Order> {
    const formData = new FormData();
    formData.append('proof', proof);

    const response: AxiosResponse<ApiResponse<Order>> = await apiClient.post(
      `${this.BASE_URL}/${id}/yape-proof`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.data;
  }

  async approvePayment(
    id: number,
    payload?: { operationNumber?: string; notes?: string }
  ): Promise<Order> {
    const response: AxiosResponse<ApiResponse<Order>> = await apiClient.post(
      `${this.BASE_URL}/${id}/approve-payment`,
      payload ?? {}
    );
    return response.data.data;
  }

  async rejectPayment(
    id: number,
    payload: { notes: string; operationNumber?: string }
  ): Promise<Order> {
    const response: AxiosResponse<ApiResponse<Order>> = await apiClient.post(
      `${this.BASE_URL}/${id}/reject-payment`,
      payload
    );
    return response.data.data;
  }
}

export const orderService = new OrderService();
