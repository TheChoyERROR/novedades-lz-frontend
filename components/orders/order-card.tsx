'use client';

import Link from 'next/link';
import { Order, OrderStatus } from '@/types';
import { Card, CardContent, Badge, Button } from '@/components/ui';
import { formatPrice, formatDate } from '@/lib/utils/format';

interface OrderCardProps {
  order: Order;
}

const statusConfig: Record<OrderStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }> = {
  [OrderStatus.PENDING]: { label: 'Pendiente', variant: 'warning' },
  [OrderStatus.PROCESSING]: { label: 'Procesando', variant: 'info' },
  [OrderStatus.SHIPPED]: { label: 'Enviado', variant: 'info' },
  [OrderStatus.DELIVERED]: { label: 'Entregado', variant: 'success' },
  [OrderStatus.CANCELLED]: { label: 'Cancelado', variant: 'danger' },
};

export function OrderCard({ order }: OrderCardProps) {
  const status = statusConfig[order.status];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-gray-900">
                Pedido #{order.id}
              </h3>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-lg font-semibold text-indigo-600">
              {formatPrice(order.totalAmount, 'PEN')}
            </p>
            <p className="text-sm text-gray-500">
              {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
            </p>
          </div>
        </div>

        {/* Order Items Preview */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="space-y-2">
            {order.items.slice(0, 3).map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.productName} x {item.quantity}
                </span>
                <span className="font-medium">
                  {formatPrice(item.subtotal, 'PEN')}
                </span>
              </div>
            ))}
            {order.items.length > 3 && (
              <p className="text-sm text-gray-500">
                +{order.items.length - 3} más...
              </p>
            )}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Dirección:</span> {order.shippingAddress}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
          <Link href={`/orders/${order.id}`}>
            <Button variant="outline" size="sm">
              Ver Detalles
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
