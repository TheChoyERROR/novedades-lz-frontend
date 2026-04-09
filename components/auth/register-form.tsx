'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/use-auth';
import { Button, Card, CardContent, Input } from '@/components/ui';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
}

const normalizePhone = (phone: string): string | undefined => {
  const compact = phone.replace(/[^\d+]/g, '');

  if (!compact) {
    return undefined;
  }

  if (/^9\d{8}$/.test(compact)) {
    return `+51${compact}`;
  }

  if (/^51\d{9}$/.test(compact)) {
    return `+${compact}`;
  }

  return compact;
};

export function RegisterForm() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    const normalizedPhone = normalizePhone(formData.phone);

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un email valido';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'El nombre debe tener al menos 3 caracteres';
    }

    if (formData.phone.trim() && !/^\+519\d{8}$/.test(normalizedPhone ?? '')) {
      newErrors.phone = 'Ingresa un celular peruano valido';
    }

    if (!formData.password) {
      newErrors.password = 'La contrasena es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contrasena debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contrasenas no coinciden';
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

    if (!validateForm()) {
      return;
    }

    const result = await register({
      email: formData.email.trim(),
      password: formData.password,
      fullName: formData.fullName.trim(),
      phone: normalizePhone(formData.phone),
    });

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
            <p className="text-gray-600 mt-2">Registrate para empezar a comprar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nombre Completo"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              placeholder="Juan Perez"
              autoComplete="name"
            />

            <Input
              label="Celular / WhatsApp"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="+51 987 654 321"
              autoComplete="tel"
            />

            <Input
              label="Correo Electronico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="correo@ejemplo.com"
              autoComplete="email"
            />

            <Input
              label="Contrasena"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="********"
              autoComplete="new-password"
            />

            <Input
              label="Confirmar Contrasena"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="********"
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
              Ya tienes una cuenta?{' '}
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Inicia Sesion
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
