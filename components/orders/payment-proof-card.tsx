'use client';

import { useMemo, useState } from 'react';
import { Order, OrderStatus } from '@/types';
import { orderService } from '@/services/order.service';
import { canUploadYapeProof, isPaymentReviewStatus, orderStatusConfig } from '@/lib/utils/order-status';
import { Badge, Button, Card, CardContent, CardHeader, ImageUpload } from '@/components/ui';
import toast from 'react-hot-toast';

interface PaymentProofCardProps {
  order: Order;
  onOrderUpdated?: (order: Order) => void;
}

const yapeRecipientPhone = process.env.NEXT_PUBLIC_YAPE_RECIPIENT_PHONE || '+51 939 662 630';

export function PaymentProofCard({ order, onOrderUpdated }: PaymentProofCardProps) {
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const canUpload = canUploadYapeProof(order);
  const status = orderStatusConfig[order.status];
  const notes = useMemo(
    () => order.notes?.split('\n').filter(Boolean) ?? [],
    [order.notes]
  );

  if (order.paymentMethod !== 'yape') {
    return null;
  }

  const handleUpload = async () => {
    if (!proofFile) {
      toast.error('Selecciona una captura antes de subirla');
      return;
    }

    setIsUploading(true);

    try {
      const updatedOrder = await orderService.uploadYapeProof(order.id, proofFile);
      setProofFile(null);
      onOrderUpdated?.(updatedOrder);
      toast.success('Comprobante enviado para revision');
    } catch (error) {
      console.error('Error uploading Yape proof:', error);
      toast.error('No se pudo subir el comprobante');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Pago por Yape</h2>
            <p className="text-sm text-gray-500">
              Yapea a {yapeRecipientPhone} y sube aqui la captura del comprobante.
            </p>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {order.operationNumber && (
          <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
            Numero de operacion registrado: <strong>{order.operationNumber}</strong>
          </div>
        )}

        {order.paymentProof && (
          <div className="space-y-3">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
              <img
                src={order.paymentProof}
                alt={`Comprobante del pedido ${order.id}`}
                className="max-h-[480px] w-full object-contain"
              />
            </div>
            <a
              href={order.paymentProof}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Ver comprobante en una pestana nueva
            </a>
          </div>
        )}

        {notes.length > 0 && (
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="mb-2 text-sm font-medium text-gray-700">Historial</p>
            <div className="space-y-2 text-sm text-gray-600">
              {notes.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </div>
          </div>
        )}

        {isPaymentReviewStatus(order.status) && (
          <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
            Tu comprobante ya fue enviado. Estamos revisandolo manualmente.
          </div>
        )}

        {order.status === OrderStatus.PAYMENT_REJECTED && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
            Tu pago fue observado. Puedes subir una nueva captura mas clara o corregida.
          </div>
        )}

        {canUpload && (
          <>
            <ImageUpload
              value={proofFile}
              onChange={setProofFile}
              currentImageUrl={null}
              label="Captura del comprobante"
              helperText="Obligatoria para pasar a revision"
            />
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={handleUpload}
                isLoading={isUploading}
                disabled={!proofFile || isUploading}
              >
                Enviar comprobante
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
