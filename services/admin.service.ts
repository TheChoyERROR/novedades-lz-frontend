import apiClient from '@/lib/api/client';
import { ApiResponse, DashboardStats } from '@/types';
import { AxiosResponse } from 'axios';

class AdminService {
  /**
   * Las cifras vienen calculadas del backend. Antes se sumaban en el navegador sobre los ultimos
   * 100 pedidos, asi que a partir del pedido 101 los ingresos quedaban congelados.
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const response: AxiosResponse<ApiResponse<DashboardStats>> =
      await apiClient.get('/admin/stats');
    return response.data.data;
  }
}

export const adminService = new AdminService();
