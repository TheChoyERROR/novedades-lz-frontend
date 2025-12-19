'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { authService } from '@/services/auth.service';
import { LoginRequest, RegisterRequest } from '@/types';
import toast from 'react-hot-toast';

export function useAuth() {
  const { user, token, isAuthenticated, isLoading, setAuth, logout, setLoading } = useAuthStore();

  // Only validate token on initial page load, not after login/register
  useEffect(() => {
    const validateSession = async () => {
      // Skip validation if we already have user data (just logged in)
      if (token && !user) {
        try {
          const isValid = await authService.validateToken();
          if (!isValid) {
            logout();
            toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
          }
        } catch (error) {
          // Token validation failed, but don't logout if we have user data
          console.error('Token validation error:', error);
        }
      }
      setLoading(false);
    };

    validateSession();
  }, []); // Only run once on mount

  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      setAuth(response.data.user, response.data.token);
      toast.success(`¡Bienvenido, ${response.data.user.fullName?.split(' ')[0]}!`);
      return { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      setAuth(response.data.user, response.data.token);
      toast.success(`¡Bienvenido, ${response.data.user.fullName?.split(' ')[0]}!`);
      return { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout: handleLogout,
  };
}
