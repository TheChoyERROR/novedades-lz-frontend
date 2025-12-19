import apiClient from '@/lib/api/client';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types';
import { AxiosResponse } from 'axios';

class AuthService {
  private readonly BASE_URL = '/auth';

  /**
   * Login user with username and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await apiClient.post(
      `${this.BASE_URL}/login`,
      credentials
    );
    return response.data;
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await apiClient.post(
      `${this.BASE_URL}/register`,
      userData
    );
    return response.data;
  }

  /**
   * Get current user profile (requires authentication)
   */
  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<User> = await apiClient.get(`${this.BASE_URL}/me`);
    return response.data;
  }

  /**
   * Validate if token is still valid
   */
  async validateToken(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const authService = new AuthService();
