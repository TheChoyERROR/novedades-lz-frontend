'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Order } from '@/types';
import { orderService } from '@/services/order.service';
import { Button, Card, CardContent, LoadingScreen, Badge } from '@/components/ui';
import { formatPrice, formatDateTime } from '@/lib/utils/format';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = Number(params.id);

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId || isNaN(orderId)) {
        setIsLoading(false);
        return;
      }

      try {
        const orderData = await orderService.getOrderById(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            No se encontró el pedido
          </h2>
          <Link href="/" className="inline-block mt-6">
            <Button>Volver al Inicio</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          ¡Pedido Confirmado!
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Gracias por tu compra. Te hemos enviado los detalles por correo.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Pedido #{order.id}
              </h2>
              <p className="text-gray-500">{formatDateTime(order.createdAt)}</p>
            </div>
            <Badge variant="warning">Pendiente</Badge>
          </div>

          {/* Order Items */}
          <div className="space-y-4 mb-6">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span className="text-gray-600">
                  {item.productName} x {item.quantity}
                </span>
                <span className="font-medium">{formatPrice(item.subtotal, 'PEN')}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-indigo-600">{formatPrice(order.totalAmount, 'PEN')}</span>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-indigo-50 rounded-lg p-4">
            <h3 className="font-semibold text-indigo-900 mb-2">
              Próximos Pasos:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-indigo-800">
              <li>Te contactaremos por WhatsApp para confirmar tu pedido</li>
              <li>Realiza el pago según el método seleccionado</li>
              <li>Envíanos el comprobante de pago</li>
              <li>Tu pedido será enviado en 24-48 horas</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Link href={`/orders/${order.id}`}>
          <Button variant="outline">Ver Detalles del Pedido</Button>
        </Link>
        <Link href="/products">
          <Button>Seguir Comprando</Button>
        </Link>
      </div>

      {/* WhatsApp CTA */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 mb-4">
          ¿Tienes alguna pregunta sobre tu pedido?
        </p>
        <a
          href="https://wa.me/51987654321"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="bg-green-500 hover:bg-green-600">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Contáctanos por WhatsApp
          </Button>
        </a>
      </div>
    </div>
  );
}
