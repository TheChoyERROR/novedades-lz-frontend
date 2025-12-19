'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth';
import { Order, OrderStatus } from '@/types';
import { orderService } from '@/services/order.service';
import { Button, Card, CardContent, Badge, Select, Spinner, Modal } from '@/components/ui';
import { formatPrice, formatDateTime } from '@/lib/utils/format';
import toast from 'react-hot-toast';

const statusConfig: Record<OrderStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }> = {
  [OrderStatus.PENDING]: { label: 'Pendiente', variant: 'warning' },
  [OrderStatus.PROCESSING]: { label: 'Procesando', variant: 'info' },
  [OrderStatus.SHIPPED]: { label: 'Enviado', variant: 'info' },
  [OrderStatus.DELIVERED]: { label: 'Entregado', variant: 'success' },
  [OrderStatus.CANCELLED]: { label: 'Cancelado', variant: 'danger' },
};

const statusOptions = [
  { value: OrderStatus.PENDING, label: 'Pendiente' },
  { value: OrderStatus.PROCESSING, label: 'Procesando' },
  { value: OrderStatus.SHIPPED, label: 'Enviado' },
  { value: OrderStatus.DELIVERED, label: 'Entregado' },
  { value: OrderStatus.CANCELLED, label: 'Cancelado' },
];

function AdminOrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('');

  const fetchOrders = async () => {
    try {
      const response = await orderService.getAllOrders({ page: 0, size: 100 });
      setOrders(response.content);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error al cargar pedidos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, { status: newStatus });
      toast.success('Estado actualizado');
      fetchOrders();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error al actualizar estado');
    }
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const filteredOrders = filterStatus
    ? orders.filter((order) => order.status === filterStatus)
    : orders;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Pedidos</h1>
        <div className="w-full sm:w-48">
          <Select
            options={[
              { value: '', label: 'Todos los estados' },
              ...statusOptions,
            ]}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const status = statusConfig[order.status];
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{order.id}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {order.shippingAddress}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateTime(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.items.length} productos
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatPrice(order.totalAmount, 'PEN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Select
                          options={statusOptions}
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value as OrderStatus)
                          }
                          className="text-sm"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openOrderDetails(order)}
                        >
                          Ver Detalles
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Pedido #${selectedOrder?.id}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <Badge variant={statusConfig[selectedOrder.status].variant}>
                  {statusConfig[selectedOrder.status].label}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha</p>
                <p className="font-medium">{formatDateTime(selectedOrder.createdAt)}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Dirección de Envío</p>
              <p className="font-medium">{selectedOrder.shippingAddress}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Productos</p>
              <div className="space-y-2 bg-gray-50 rounded-lg p-4">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.productName} x {item.quantity}
                    </span>
                    <span className="font-medium">
                      {formatPrice(item.subtotal, 'PEN')}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-indigo-600">
                    {formatPrice(selectedOrder.totalAmount, 'PEN')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={() => setIsModalOpen(false)}>Cerrar</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminOrdersContent />
    </ProtectedRoute>
  );
}
