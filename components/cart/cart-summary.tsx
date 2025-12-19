'use client';

import Link from 'next/link';
import { useCartStore } from '@/stores/cart-store';
import { CartItem } from './cart-item';
import { Button, Card, CardContent, CardFooter } from '@/components/ui';
import { formatPrice } from '@/lib/utils/format';

export function CartSummary() {
  const { items, totalItems, totalAmount, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-16 w-16 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          Tu carrito está vacío
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Explora nuestros productos y agrega algo al carrito.
        </p>
        <Link href="/products">
          <Button className="mt-6">Ver Productos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <Card>
          <CardContent className="divide-y divide-gray-100">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Carrito de Compras ({totalItems} {totalItems === 1 ? 'item' : 'items'})
              </h2>
              <Button variant="ghost" size="sm" onClick={clearCart} className="text-red-600">
                Vaciar Carrito
              </Button>
            </div>
            {items.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardContent>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Resumen del Pedido
            </h2>

            <dl className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <dt>Subtotal ({totalItems} items)</dt>
                <dd>{formatPrice(totalAmount, 'PEN')}</dd>
              </div>
              <div className="flex justify-between text-gray-600">
                <dt>Envío</dt>
                <dd className="text-green-600">Gratis</dd>
              </div>
            </dl>

            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between text-lg font-semibold text-gray-900">
                <dt>Total</dt>
                <dd className="text-indigo-600">{formatPrice(totalAmount, 'PEN')}</dd>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/checkout" className="w-full">
              <Button className="w-full" size="lg">
                Proceder al Pago
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
