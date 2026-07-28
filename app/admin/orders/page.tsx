'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ProtectedRoute } from '@/components/auth';
import { Order, OrderStatus } from '@/types';
import { orderService } from '@/services/order.service';
import { Badge, Button, Card, CardContent, Modal, Spinner } from '@/components/ui';
import { formatDateTime, formatPrice } from '@/lib/utils/format';
import { adminOrderFilterOptions, orderStatusConfig } from '@/lib/utils/order-status';
import { ListToolbar, PaginationBar } from '@/components/ui/list-controls';
import { DEFAULT_PAGE_SIZE } from '@/lib/pagination';
import { fulfillmentLabel, isPickupOrder } from '@/lib/orders/fulfillment';
import toast from 'react-hot-toast';

function AdminOrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [reviewOperationNumber, setReviewOperationNumber] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      // El filtro por estado se resuelve en el backend junto con la busqueda; antes se traian 100
      // pedidos y se filtraban en memoria, asi que a partir del pedido 101 el panel mentia.
      const response = await orderService.getAllOrders({
        page,
        size: pageSize,
        status: (filterStatus || undefined) as OrderStatus | undefined,
        customerPhone: appliedSearch || undefined,
        sortBy: 'createdAt',
        direction: 'DESC',
      });
      setOrders(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error al cargar pedidos');
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, filterStatus, appliedSearch]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  const pendingReviewCount = useMemo(
    () => orders.filter((order) => order.status === OrderStatus.PAYMENT_REVIEW).length,
    [orders]
  );



  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setReviewOperationNumber(order.operationNumber ?? '');
    setReviewNotes('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setReviewOperationNumber('');
    setReviewNotes('');
    setIsModalOpen(false);
  };

  const refreshSelectedOrder = (updatedOrder: Order) => {
    setSelectedOrder(updatedOrder);
    setOrders((currentOrders) =>
      currentOrders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
    );
  };

  const handleApprovePayment = async () => {
    if (!selectedOrder) return;

    setIsSubmittingAction(true);

    try {
      const updatedOrder = await orderService.approvePayment(selectedOrder.id, {
        operationNumber: reviewOperationNumber,
        notes: reviewNotes,
      });
      refreshSelectedOrder(updatedOrder);
      toast.success('Pago aprobado correctamente');
      await fetchOrders();
    } catch (error) {
      console.error('Error approving payment:', error);
      toast.error('No se pudo aprobar el pago');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleRejectPayment = async () => {
    if (!selectedOrder) return;

    if (!reviewNotes.trim()) {
      toast.error('Escribe el motivo del rechazo');
      return;
    }

    setIsSubmittingAction(true);

    try {
      const updatedOrder = await orderService.rejectPayment(selectedOrder.id, {
        notes: reviewNotes.trim(),
        operationNumber: reviewOperationNumber || undefined,
      });
      refreshSelectedOrder(updatedOrder);
      toast.success('Pago rechazado');
      await fetchOrders();
    } catch (error) {
      console.error('Error rejecting payment:', error);
      toast.error('No se pudo rechazar el pago');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (!selectedOrder) return;

    setIsSubmittingAction(true);

    try {
      const updatedOrder = await orderService.updateOrderStatus(selectedOrder.id, newStatus);
      refreshSelectedOrder(updatedOrder);
      toast.success('Estado actualizado');
      await fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('No se pudo actualizar el estado');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion de Pedidos</h1>
          <p className="mt-2 text-gray-600">
            {pendingReviewCount > 0
              ? `Tienes ${pendingReviewCount} pedido${pendingReviewCount === 1 ? '' : 's'} esperando revision de pago.`
              : 'No hay comprobantes pendientes por revisar.'}
          </p>
        </div>
      </div>

      <ListToolbar
        search={search}
        onSearchChange={setSearch}
        onSubmit={() => {
          setPage(0);
          setAppliedSearch(search.trim());
        }}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPage(0);
          setPageSize(size);
        }}
        placeholder="Buscar por pedido, nombre o telefono..."
      >
        <select
          value={filterStatus}
          onChange={(event) => {
            setPage(0);
            setFilterStatus(event.target.value);
          }}
          aria-label="Filtrar por estado"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {adminOrderFilterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </ListToolbar>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Pago
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className={order.status === OrderStatus.PAYMENT_REVIEW ? 'bg-blue-50/60' : 'hover:bg-gray-50'}
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                      <div className="text-sm text-gray-500">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{formatDateTime(order.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="font-medium text-gray-900">{fulfillmentLabel(order.paymentMethod)}</div>
                      <div>{order.paymentProof ? 'Con comprobante' : 'Sin comprobante'}</div>
                      <div>{order.operationNumber ? `Op: ${order.operationNumber}` : 'Op: pendiente'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(order.total, 'PEN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={orderStatusConfig[order.status].variant}>
                        {orderStatusConfig[order.status].label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm" onClick={() => openOrderDetails(order)}>
                        Revisar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <PaginationBar
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={setPage}
        itemLabel="pedidos"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedOrder ? `Pedido ${selectedOrder.orderNumber}` : 'Detalle del pedido'}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <Badge variant={orderStatusConfig[selectedOrder.status].variant}>
                  {orderStatusConfig[selectedOrder.status].label}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cliente</p>
                <p className="font-medium text-gray-900">{selectedOrder.customerName}</p>
                <p className="text-sm text-gray-600">{selectedOrder.customerPhone}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Metodo de pago</p>
                <p className="font-medium text-gray-900">
                  {isPickupOrder(selectedOrder.paymentMethod) ? 'Efectivo en tienda' : 'Yape'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-medium text-primary-600">{formatPrice(selectedOrder.total, 'PEN')}</p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-500">Entrega</p>
              <p className="font-medium text-gray-900">
                {isPickupOrder(selectedOrder.paymentMethod)
                  ? 'Recojo en tienda (paga en efectivo al retirar)'
                  : [selectedOrder.customerAddress, selectedOrder.customerCity]
                      .filter(Boolean)
                      .join(', ')}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-500">Productos</p>
              <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.productName} x {item.quantity}
                    </span>
                    <span className="font-medium">{formatPrice(item.subtotal, 'PEN')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Comprobante</p>
                {selectedOrder.whatsappSent && (
                  <span className="text-xs font-medium text-green-700">WhatsApp admin enviado</span>
                )}
              </div>

              {selectedOrder.paymentProof ? (
                <>
                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    <img
                      src={selectedOrder.paymentProof}
                      alt={`Comprobante del pedido ${selectedOrder.id}`}
                      className="max-h-[420px] w-full object-contain"
                    />
                  </div>
                  <a
                    href={selectedOrder.paymentProof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    Abrir comprobante en una pestana nueva
                  </a>
                </>
              ) : (
                <div className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">
                  Este pedido aun no tiene comprobante adjunto.
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Numero de operacion
                </label>
                <input
                  type="text"
                  value={reviewOperationNumber}
                  onChange={(e) => setReviewOperationNumber(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ej. 12345678"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Notas internas
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Motivo de rechazo, observaciones o comentario de aprobacion"
                />
              </div>
            </div>

            {selectedOrder.notes && (
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="mb-2 text-sm font-medium text-gray-700">Historial del pedido</p>
                <div className="space-y-2 text-sm text-gray-600">
                  {selectedOrder.notes.split('\n').filter(Boolean).map((note) => (
                    <p key={note}>{note}</p>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap justify-end gap-3 pt-4">
              {selectedOrder.status === OrderStatus.PAYMENT_REVIEW && (
                <>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={handleRejectPayment}
                    isLoading={isSubmittingAction}
                  >
                    Rechazar pago
                  </Button>
                  <Button
                    type="button"
                    onClick={handleApprovePayment}
                    isLoading={isSubmittingAction}
                  >
                    Aprobar pago
                  </Button>
                </>
              )}

              {selectedOrder.status === OrderStatus.CONFIRMED && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void handleStatusUpdate(OrderStatus.CANCELLED)}
                    isLoading={isSubmittingAction}
                  >
                    Cancelar pedido
                  </Button>
                  <Button
                    type="button"
                    onClick={() => void handleStatusUpdate(OrderStatus.DELIVERED)}
                    isLoading={isSubmittingAction}
                  >
                    Marcar entregado
                  </Button>
                </>
              )}

              {selectedOrder.status === OrderStatus.PENDING && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void handleStatusUpdate(OrderStatus.CANCELLED)}
                  isLoading={isSubmittingAction}
                >
                  Cancelar pedido
                </Button>
              )}

              {selectedOrder.status === OrderStatus.PAYMENT_REJECTED && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void handleStatusUpdate(OrderStatus.CANCELLED)}
                  isLoading={isSubmittingAction}
                >
                  Cancelar pedido
                </Button>
              )}

              <Button type="button" variant="ghost" onClick={closeModal}>
                Cerrar
              </Button>
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
