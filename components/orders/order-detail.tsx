'use client';

import { Order, OrderStatus } from '@/types';
import { Badge, Card, CardContent, CardHeader } from '@/components/ui';
import { formatDateTime, formatPrice } from '@/lib/utils/format';
import { orderStatusConfig } from '@/lib/utils/order-status';
import { PaymentProofCard } from './payment-proof-card';

interface OrderDetailProps {
  order: Order;
  onOrderUpdated?: (order: Order) => void;
}

export function OrderDetail({ order, onOrderUpdated }: OrderDetailProps) {
  const status = orderStatusConfig[order.status];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pedido #{order.id}</h1>
              <p className="text-gray-500 mt-1">Realizado el {formatDateTime(order.createdAt)}</p>
            </div>
            <Badge variant={status.variant} size="md">
              {status.label}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <PaymentProofCard order={order} onOrderUpdated={onOrderUpdated} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                      <h3 className="font-medium text-gray-900">{item.productName}</h3>
                      <p className="text-sm text-gray-500">
                        {formatPrice(item.unitPrice, 'PEN')} x {item.quantity}
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

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Resumen</h2>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Subtotal</dt>
                  <dd className="font-medium">{formatPrice(order.total, 'PEN')}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Envio</dt>
                  <dd className="text-green-600 font-medium">Gratis</dd>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3">
                  <dt className="text-lg font-semibold text-gray-900">Total</dt>
                  <dd className="text-lg font-semibold text-indigo-600">
                    {formatPrice(order.total, 'PEN')}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Direccion de Envio</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {[order.customerAddress, order.customerCity].filter(Boolean).join(', ')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Estado del Pedido</h2>
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
                  title="Comprobante en Revision"
                  date={
                    [OrderStatus.PAYMENT_REVIEW, OrderStatus.PAYMENT_REJECTED, OrderStatus.CONFIRMED, OrderStatus.DELIVERED].includes(order.status)
                      ? formatDateTime(order.updatedAt)
                      : undefined
                  }
                  isCompleted={[
                    OrderStatus.PAYMENT_REVIEW,
                    OrderStatus.PAYMENT_REJECTED,
                    OrderStatus.CONFIRMED,
                    OrderStatus.DELIVERED,
                  ].includes(order.status)}
                  isActive={order.status === OrderStatus.PAYMENT_REVIEW}
                />
                <TimelineItem
                  title="Pedido Confirmado"
                  date={
                    [OrderStatus.CONFIRMED, OrderStatus.DELIVERED].includes(order.status)
                      ? formatDateTime(order.updatedAt)
                      : undefined
                  }
                  isCompleted={[OrderStatus.CONFIRMED, OrderStatus.DELIVERED].includes(order.status)}
                  isActive={order.status === OrderStatus.CONFIRMED}
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
                {order.status === OrderStatus.PAYMENT_REJECTED && (
                  <div className="mt-4 rounded-lg bg-red-50 p-3">
                    <p className="text-sm font-medium text-red-800">
                      Tu comprobante fue observado. Sube una nueva captura para continuar.
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
            isCompleted ? 'bg-indigo-600' : isActive ? 'bg-indigo-300' : 'bg-gray-200'
          }`}
        />
        {!isLast && (
          <div className={`w-0.5 h-8 ${isCompleted ? 'bg-indigo-600' : 'bg-gray-200'}`} />
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
