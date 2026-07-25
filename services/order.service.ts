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

  /**
   * `token` es obligatorio para clientes. Un admin autenticado puede omitirlo: el backend
   * autoriza por rol.
   */
  async getOrderById(id: number, token?: string | null): Promise<Order> {
    const response: AxiosResponse<ApiResponse<Order>> = await apiClient.get(
      `${this.BASE_URL}/${id}`,
      { params: token ? { token } : undefined }
    );
    return response.data.data;
  }

  async trackOrder(orderNumber: string, customerPhone: string): Promise<Order> {
    const response: AxiosResponse<ApiResponse<Order>> = await apiClient.post(
      `${this.BASE_URL}/track`,
      { orderNumber, customerPhone }
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

  async uploadYapeProof(id: number, proof: File, token?: string | null): Promise<Order> {
    const formData = new FormData();
    formData.append('proof', proof);

    const response: AxiosResponse<ApiResponse<Order>> = await apiClient.post(
      `${this.BASE_URL}/${id}/yape-proof`,
      formData,
      {
        params: token ? { token } : undefined,
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
