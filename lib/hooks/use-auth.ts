'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { authService } from '@/services/auth.service';
import { LoginRequest, RegisterRequest } from '@/types';
import toast from 'react-hot-toast';

export function useAuth() {
  const { user, token, isAuthenticated, isLoading, setAuth, logout, setLoading } = useAuthStore();

  useEffect(() => {
    const validateSession = async () => {
      if (token && !user) {
        try {
          const isValid = await authService.validateToken();
          if (!isValid) {
            logout();
            toast.error('Sesion expirada. Por favor inicia sesion nuevamente.');
          }
        } catch (error) {
          console.error('Token validation error:', error);
        }
      }

      setLoading(false);
    };

    void validateSession();
  }, [logout, setLoading, token, user]);

  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      setAuth(response.data.user, response.data.token);
      toast.success(`Bienvenido, ${response.data.user.fullName?.split(' ')[0]}!`);
      return { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesion';
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
      toast.success(`Bienvenido, ${response.data.user.fullName?.split(' ')[0]}!`);
      return { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al registrarte';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Sesion cerrada');
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
