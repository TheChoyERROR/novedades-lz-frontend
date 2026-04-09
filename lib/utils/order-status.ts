import { Order, OrderStatus } from '@/types';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

export const orderStatusConfig: Record<OrderStatus, { label: string; variant: BadgeVariant }> = {
  [OrderStatus.PENDING]: { label: 'Pendiente', variant: 'warning' },
  [OrderStatus.PAYMENT_REVIEW]: { label: 'Pago en revision', variant: 'info' },
  [OrderStatus.PAYMENT_REJECTED]: { label: 'Pago rechazado', variant: 'danger' },
  [OrderStatus.CONFIRMED]: { label: 'Confirmado', variant: 'info' },
  [OrderStatus.DELIVERED]: { label: 'Entregado', variant: 'success' },
  [OrderStatus.CANCELLED]: { label: 'Cancelado', variant: 'danger' },
};

export const adminOrderFilterOptions = [
  { value: '', label: 'Todos los estados' },
  { value: OrderStatus.PENDING, label: orderStatusConfig[OrderStatus.PENDING].label },
  { value: OrderStatus.PAYMENT_REVIEW, label: orderStatusConfig[OrderStatus.PAYMENT_REVIEW].label },
  { value: OrderStatus.PAYMENT_REJECTED, label: orderStatusConfig[OrderStatus.PAYMENT_REJECTED].label },
  { value: OrderStatus.CONFIRMED, label: orderStatusConfig[OrderStatus.CONFIRMED].label },
  { value: OrderStatus.DELIVERED, label: orderStatusConfig[OrderStatus.DELIVERED].label },
  { value: OrderStatus.CANCELLED, label: orderStatusConfig[OrderStatus.CANCELLED].label },
];

export function canUploadYapeProof(order: Pick<Order, 'paymentMethod' | 'status'>): boolean {
  return order.paymentMethod === 'yape' && (
    order.status === OrderStatus.PENDING ||
    order.status === OrderStatus.PAYMENT_REJECTED
  );
}

export function isPaymentReviewStatus(status: OrderStatus): boolean {
  return status === OrderStatus.PAYMENT_REVIEW;
}
