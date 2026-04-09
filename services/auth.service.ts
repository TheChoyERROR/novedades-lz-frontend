import apiClient from '@/lib/api/client';
import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, User } from '@/types';
import { AxiosResponse } from 'axios';

class AuthService {
  private readonly BASE_URL = '/auth';

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await apiClient.post(
      `${this.BASE_URL}/login`,
      credentials
    );
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await apiClient.post(
      `${this.BASE_URL}/register`,
      userData
    );
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await apiClient.get(`${this.BASE_URL}/me`);
    return response.data.data;
  }

  async validateToken(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch {
      return false;
    }
  }
}

export const authService = new AuthService();
