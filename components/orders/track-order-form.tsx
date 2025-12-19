'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, Card, CardContent } from '@/components/ui';
import { orderService } from '@/services/order.service';
import toast from 'react-hot-toast';

export function TrackOrderForm() {
  const router = useRouter();
  const [orderId, setOrderId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!orderId.trim()) {
      setError('Ingresa el número de pedido');
      return;
    }

    const numericId = parseInt(orderId.trim(), 10);
    if (isNaN(numericId)) {
      setError('El número de pedido debe ser numérico');
      return;
    }

    setIsLoading(true);

    try {
      await orderService.getOrderById(numericId);
      router.push(`/orders/${numericId}`);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('No se encontró el pedido');
      setError('No se encontró ningún pedido con ese número');
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
              className="mx-auto h-12 w-12 text-indigo-600"
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
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Rastrear Pedido
            </h2>
            <p className="mt-2 text-gray-600">
              Ingresa el número de tu pedido para ver su estado
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Número de Pedido"
              value={orderId}
              onChange={(e) => {
                setOrderId(e.target.value);
                setError('');
              }}
              error={error}
              placeholder="Ej: 12345"
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Buscar Pedido
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
