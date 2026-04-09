'use client';

import Link from 'next/link';
import { Order } from '@/types';
import { Badge, Button, Card, CardContent } from '@/components/ui';
import { formatDate, formatPrice } from '@/lib/utils/format';
import { orderStatusConfig } from '@/lib/utils/order-status';

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const status = orderStatusConfig[order.status];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-gray-900">Pedido #{order.id}</h3>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
            <p className="text-sm text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
          </div>

          <div className="text-right">
            <p className="text-lg font-semibold text-indigo-600">
              {formatPrice(order.total, 'PEN')}
            </p>
            <p className="text-sm text-gray-500">
              {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="space-y-2">
            {order.items.slice(0, 3).map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.productName} x {item.quantity}
                </span>
                <span className="font-medium">{formatPrice(item.subtotal, 'PEN')}</span>
              </div>
            ))}
            {order.items.length > 3 && (
              <p className="text-sm text-gray-500">+{order.items.length - 3} mas...</p>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Direccion:</span>{' '}
            {[order.customerAddress, order.customerCity].filter(Boolean).join(', ')}
          </p>
        </div>

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
