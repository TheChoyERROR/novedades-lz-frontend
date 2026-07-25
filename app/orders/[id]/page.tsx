'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Order } from '@/types';
import { orderService } from '@/services/order.service';
import { rememberOrderToken, resolveOrderToken } from '@/lib/orders/order-access';
import { OrderDetail } from '@/components/orders';
import { Button, LoadingScreen } from '@/components/ui';

function OrderDetailPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = Number(params.id);
  const tokenFromUrl = searchParams.get('token');
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId || isNaN(orderId)) {
        setError('Pedido no encontrado');
        setIsLoading(false);
        return;
      }

      const token = resolveOrderToken(orderId, tokenFromUrl);
      setAccessToken(token);

      if (!token) {
        setError('Necesitamos verificar que este pedido es tuyo');
        setIsLoading(false);
        return;
      }

      try {
        const orderData = await orderService.getOrderById(orderId, token);
        rememberOrderToken(orderId, orderData.publicToken ?? token);
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('No se pudo cargar el pedido');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchOrder();
  }, [orderId, tokenFromUrl]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            {error || 'Pedido no encontrado'}
          </h2>
          <p className="mt-2 text-gray-600">
            El pedido que buscas no existe, o este enlace no acredita que sea tuyo. Buscalo con su
            numero y el telefono con el que lo registraste.
          </p>
          <Link href="/track-order" className="inline-block mt-6">
            <Button>Buscar Otro Pedido</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link href="/" className="text-gray-500 hover:text-primary-600">
              Inicio
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <Link href="/track-order" className="text-gray-500 hover:text-primary-600">
              Rastrear Pedido
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 font-medium">{order.orderNumber}</li>
        </ol>
      </nav>

        <OrderDetail order={order} onOrderUpdated={setOrder} accessToken={accessToken} />
      </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <OrderDetailPageContent />
    </Suspense>
  );
}
