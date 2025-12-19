'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/use-auth';
import { Input, Button, Card, CardContent } from '@/components/ui';

export function LoginForm() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un email válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await login(formData);
    if (result.success) {
      router.push('/');
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h1>
            <p className="text-gray-600 mt-2">
              Ingresa a tu cuenta para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Correo Electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="correo@ejemplo.com"
              autoComplete="email"
            />

            <Input
              label="Contraseña"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
              autoComplete="current-password"
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Iniciar Sesión
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link href="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Regístrate
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
