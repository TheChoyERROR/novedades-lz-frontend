'use client';

import { Order, OrderStatus } from '@/types';
import { Card, CardContent, CardHeader, Badge } from '@/components/ui';
import { formatPrice, formatDateTime } from '@/lib/utils/format';

interface OrderDetailProps {
  order: Order;
}

const statusConfig: Record<OrderStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }> = {
  [OrderStatus.PENDING]: { label: 'Pendiente', variant: 'warning' },
  [OrderStatus.PROCESSING]: { label: 'Procesando', variant: 'info' },
  [OrderStatus.SHIPPED]: { label: 'Enviado', variant: 'info' },
  [OrderStatus.DELIVERED]: { label: 'Entregado', variant: 'success' },
  [OrderStatus.CANCELLED]: { label: 'Cancelado', variant: 'danger' },
};

export function OrderDetail({ order }: OrderDetailProps) {
  const status = statusConfig[order.status];

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Pedido #{order.id}
              </h1>
              <p className="text-gray-500 mt-1">
                Realizado el {formatDateTime(order.createdAt)}
              </p>
            </div>
            <Badge variant={status.variant} size="md">
              {status.label}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">
                Productos ({order.items.length})
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatPrice(item.price, 'PEN')} x {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(item.subtotal, 'PEN')}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">
                Resumen
              </h2>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Subtotal</dt>
                  <dd className="font-medium">{formatPrice(order.totalAmount, 'PEN')}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Envío</dt>
                  <dd className="text-green-600 font-medium">Gratis</dd>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3">
                  <dt className="text-lg font-semibold text-gray-900">Total</dt>
                  <dd className="text-lg font-semibold text-indigo-600">
                    {formatPrice(order.totalAmount, 'PEN')}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">
                Dirección de Envío
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{order.shippingAddress}</p>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">
                Estado del Pedido
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <TimelineItem
                  title="Pedido Recibido"
                  date={formatDateTime(order.createdAt)}
                  isCompleted={true}
                  isActive={order.status === OrderStatus.PENDING}
                />
                <TimelineItem
                  title="Procesando"
                  isCompleted={[OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED].includes(order.status)}
                  isActive={order.status === OrderStatus.PROCESSING}
                />
                <TimelineItem
                  title="Enviado"
                  isCompleted={[OrderStatus.SHIPPED, OrderStatus.DELIVERED].includes(order.status)}
                  isActive={order.status === OrderStatus.SHIPPED}
                />
                <TimelineItem
                  title="Entregado"
                  date={order.status === OrderStatus.DELIVERED ? formatDateTime(order.updatedAt) : undefined}
                  isCompleted={order.status === OrderStatus.DELIVERED}
                  isActive={order.status === OrderStatus.DELIVERED}
                  isLast
                />
                {order.status === OrderStatus.CANCELLED && (
                  <div className="mt-4 p-3 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-800 font-medium">
                      Este pedido fue cancelado
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface TimelineItemProps {
  title: string;
  date?: string;
  isCompleted: boolean;
  isActive: boolean;
  isLast?: boolean;
}

function TimelineItem({ title, date, isCompleted, isActive, isLast }: TimelineItemProps) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div
          className={`w-4 h-4 rounded-full ${
            isCompleted
              ? 'bg-indigo-600'
              : isActive
              ? 'bg-indigo-300'
              : 'bg-gray-200'
          }`}
        />
        {!isLast && (
          <div
            className={`w-0.5 h-8 ${isCompleted ? 'bg-indigo-600' : 'bg-gray-200'}`}
          />
        )}
      </div>
      <div className="-mt-0.5">
        <p className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
          {title}
        </p>
        {date && <p className="text-sm text-gray-500">{date}</p>}
      </div>
    </div>
  );
}
