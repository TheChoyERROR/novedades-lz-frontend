'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/use-auth';
import { Input, Button, Card, CardContent } from '@/components/ui';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export function RegisterForm() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'El usuario es requerido';
    } else if (formData.username.length < 3) {
      newErrors.username = 'El usuario debe tener al menos 3 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un email válido';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);
    if (result.success) {
      router.push('/');
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Crear Cuenta</h1>
            <p className="text-gray-600 mt-2">
              Regístrate para empezar a comprar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nombre Completo"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              placeholder="Juan Pérez"
            />

            <Input
              label="Usuario"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              placeholder="juanperez"
              autoComplete="username"
            />

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
              autoComplete="new-password"
            />

            <Input
              label="Confirmar Contraseña"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="••••••••"
              autoComplete="new-password"
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Crear Cuenta
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Inicia Sesión
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
