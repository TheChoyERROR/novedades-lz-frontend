'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cart-store';
import { orderService } from '@/services/order.service';
import { Input, Select, Button, Card, CardContent, CardFooter } from '@/components/ui';
import { formatPrice } from '@/lib/utils/format';
import toast from 'react-hot-toast';

const paymentMethods = [
  { value: 'yape', label: 'Yape' },
  { value: 'plin', label: 'Plin' },
  { value: 'transferencia', label: 'Transferencia Bancaria' },
  { value: 'efectivo', label: 'Contra Entrega (Efectivo)' },
];

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
    paymentMethod: 'yape',
  });
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutFormData> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'El nombre es requerido';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'El teléfono es requerido';
    } else if (!/^\+?[\d\s-]{9,}$/.test(formData.customerPhone)) {
      newErrors.customerPhone = 'Ingresa un teléfono válido';
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Ingresa un email válido';
    }

    if (!formData.customerAddress.trim()) {
      newErrors.customerAddress = 'La dirección es requerida';
    }

    if (!formData.customerCity.trim()) {
      newErrors.customerCity = 'La ciudad es requerida';
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
      toast.error('Tu carrito está vacío');
      return;
    }

    setIsLoading(true);

    try {
      const orderData = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        customerAddress: formData.customerAddress,
        customerCity: formData.customerCity,
        paymentMethod: formData.paymentMethod,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      const order = await orderService.createOrder(orderData);
      clearCart();
      toast.success('¡Pedido creado exitosamente!');
      router.push(`/order-confirmation/${order.id}`);
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
        {/* Customer Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Información de Contacto
              </h2>

              <div className="space-y-4">
                <Input
                  label="Nombre Completo"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  error={errors.customerName}
                  placeholder="Juan Pérez"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Teléfono / WhatsApp"
                    name="customerPhone"
                    type="tel"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    error={errors.customerPhone}
                    placeholder="+51 987 654 321"
                  />

                  <Input
                    label="Correo Electrónico"
                    name="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    error={errors.customerEmail}
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Dirección de Envío
              </h2>

              <div className="space-y-4">
                <Input
                  label="Dirección"
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

          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Método de Pago
              </h2>

              <Select
                label="Selecciona método de pago"
                name="paymentMethod"
                options={paymentMethods}
                value={formData.paymentMethod}
                onChange={handleChange}
              />

              <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
                <p className="text-sm text-indigo-800">
                  <strong>Nota:</strong> Después de realizar el pedido, te contactaremos
                  por WhatsApp para confirmar el pago y coordinar el envío.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Tu Pedido
              </h2>

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
                  <span>Envío</span>
                  <span className="text-green-600">Gratis</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span className="text-indigo-600">{formatPrice(totalAmount, 'PEN')}</span>
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
                Confirmar Pedido
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </form>
  );
}
