'use client';

import Link from 'next/link';
import { useCartStore } from '@/stores/cart-store';
import { CheckoutForm } from '@/components/cart';
import { Button } from '@/components/ui';

export default function CheckoutPage() {
  const { items } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
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
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Tu carrito está vacío
          </h2>
          <p className="mt-2 text-gray-600">
            Agrega algunos productos para continuar con el pago.
          </p>
          <Link href="/products" className="inline-block mt-6">
            <Button>Ver Productos</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link href="/" className="text-gray-500 hover:text-indigo-600">
              Inicio
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <Link href="/cart" className="text-gray-500 hover:text-indigo-600">
              Carrito
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 font-medium">Checkout</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Finalizar Compra
      </h1>
      
      <CheckoutForm />
    </div>
  );
}
