'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cart-store';
import { orderService } from '@/services/order.service';
import { rememberOrderToken } from '@/lib/orders/order-access';
import { Button, Card, CardContent, CardFooter, Input, Select } from '@/components/ui';
import { formatPrice } from '@/lib/utils/format';
import { fulfillmentOptions, requiresShippingAddress, YAPE } from '@/lib/orders/fulfillment';
import toast from 'react-hot-toast';

interface CheckoutFormData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  customerCity: string;
  paymentMethod: string;
}

export function CheckoutForm() {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    customerCity: '',
    paymentMethod: YAPE,
  });
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});

  const needsAddress = requiresShippingAddress(formData.paymentMethod);

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutFormData> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'El nombre es requerido';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'El telefono es requerido';
    } else if (!/^\+?[\d\s-]{9,}$/.test(formData.customerPhone)) {
      newErrors.customerPhone = 'Ingresa un telefono valido';
    }

    if (
      formData.customerEmail.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)
    ) {
      newErrors.customerEmail = 'Ingresa un email valido';
    }

    if (needsAddress) {
      if (!formData.customerAddress.trim()) {
        newErrors.customerAddress = 'La direccion es requerida';
      }

      if (!formData.customerCity.trim()) {
        newErrors.customerCity = 'La ciudad es requerida';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof CheckoutFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (items.length === 0) {
      toast.error('Tu carrito esta vacio');
      return;
    }

    setIsLoading(true);

    try {
      const orderData = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail.trim() || undefined,
        customerAddress: needsAddress ? formData.customerAddress : undefined,
        customerCity: needsAddress ? formData.customerCity : undefined,
        paymentMethod: formData.paymentMethod,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      const order = await orderService.createOrder(orderData);
      // El token es la unica forma de volver a este pedido: se guarda antes de navegar.
      rememberOrderToken(order.id, order.publicToken);
      clearCart();
      toast.success('Pedido creado exitosamente');
      router.push(
        order.publicToken
          ? `/order-confirmation/${order.id}?token=${encodeURIComponent(order.publicToken)}`
          : `/order-confirmation/${order.id}`
      );
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Error al procesar el pedido. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Va primero: la eleccion define que datos se le piden despues. */}
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Como quieres recibir tu pedido
              </h2>

              <Select
                label="Elige una opcion"
                name="paymentMethod"
                options={fulfillmentOptions}
                value={formData.paymentMethod}
                onChange={handleChange}
              />

              <div className="mt-4 rounded-lg bg-primary-50 p-4">
                <p className="text-sm text-primary-800">
                  {needsAddress ? (
                    <>
                      <strong>Pago por Yape.</strong> Al terminar podras subir la captura de tu
                      pago y te avisamos por WhatsApp cuando lo confirmemos.
                    </>
                  ) : (
                    <>
                      <strong>Pagas al recoger.</strong> Escribenos por WhatsApp con tu numero de
                      pedido y coordinamos cuando pasas por el local.
                    </>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Informacion de Contacto
              </h2>

              <div className="space-y-4">
                <Input
                  label="Nombre Completo"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  error={errors.customerName}
                  placeholder="Juan Perez"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Telefono / WhatsApp"
                    name="customerPhone"
                    type="tel"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    error={errors.customerPhone}
                    placeholder="+51 987 654 321"
                  />

                  <Input
                    label="Correo Electronico (opcional)"
                    name="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    error={errors.customerEmail}
                    placeholder="Puedes dejarlo vacio"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {needsAddress ? (
            <Card>
            <CardContent>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Direccion de Envio
              </h2>

              <div className="space-y-4">
                <Input
                  label="Direccion"
                  name="customerAddress"
                  value={formData.customerAddress}
                  onChange={handleChange}
                  error={errors.customerAddress}
                  placeholder="Av. Principal 123, Dpto 4B"
                />

                <Input
                  label="Ciudad"
                  name="customerCity"
                  value={formData.customerCity}
                  onChange={handleChange}
                  error={errors.customerCity}
                  placeholder="Lima"
                />
              </div>
            </CardContent>
            </Card>
          ) : null}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tu Pedido</h2>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product.name} x {item.quantity}
                    </span>
                    <span className="font-medium">
                      {formatPrice(item.product.price * item.quantity, 'PEN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalAmount, 'PEN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{needsAddress ? 'Envio' : 'Entrega'}</span>
                  <span className="text-green-600">
                    {needsAddress ? 'Gratis' : 'Recojo en tienda'}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary-600">{formatPrice(totalAmount, 'PEN')}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {needsAddress ? 'Confirmar Pedido' : 'Reservar para recojo'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </form>
  );
}
