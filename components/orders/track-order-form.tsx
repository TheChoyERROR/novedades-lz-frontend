'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, Card, CardContent } from '@/components/ui';
import { orderService } from '@/services/order.service';
import { rememberOrderToken } from '@/lib/orders/order-access';
import toast from 'react-hot-toast';

interface TrackFormErrors {
  orderNumber?: string;
  customerPhone?: string;
}

export function TrackOrderForm() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<TrackFormErrors>({});

  const validate = (): boolean => {
    const nextErrors: TrackFormErrors = {};

    if (!orderNumber.trim()) {
      nextErrors.orderNumber = 'Ingresa el numero de pedido';
    }

    if (!customerPhone.trim()) {
      nextErrors.customerPhone = 'Ingresa el telefono del pedido';
    } else if (customerPhone.replace(/\D/g, '').length < 9) {
      nextErrors.customerPhone = 'Ingresa un telefono valido';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const order = await orderService.trackOrder(orderNumber.trim(), customerPhone.trim());
      rememberOrderToken(order.id, order.publicToken);

      router.push(
        order.publicToken
          ? `/orders/${order.id}?token=${encodeURIComponent(order.publicToken)}`
          : `/orders/${order.id}`
      );
    } catch (error) {
      console.error('Error fetching order:', error);
      // Mismo mensaje siempre: no confirmamos si el numero existe pero el telefono no coincide.
      const message = 'No encontramos un pedido con ese numero y telefono';
      toast.error(message);
      setErrors({ orderNumber: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <svg
              className="mx-auto h-12 w-12 text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">Rastrear Pedido</h2>
            <p className="mt-2 text-gray-600">
              Ingresa el numero de pedido y el telefono con el que lo registraste
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Numero de Pedido"
              value={orderNumber}
              onChange={(e) => {
                setOrderNumber(e.target.value);
                setErrors((prev) => ({ ...prev, orderNumber: undefined }));
              }}
              error={errors.orderNumber}
              placeholder="Ej: ORD-20260725-0001"
            />

            <Input
              label="Telefono del pedido"
              type="tel"
              value={customerPhone}
              onChange={(e) => {
                setCustomerPhone(e.target.value);
                setErrors((prev) => ({ ...prev, customerPhone: undefined }));
              }}
              error={errors.customerPhone}
              placeholder="987 654 321"
            />

            <Button type="submit" className="w-full" isLoading={isLoading} disabled={isLoading}>
              Buscar Pedido
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
