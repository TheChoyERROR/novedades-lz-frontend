'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/stores/cart-store';
import { formatPrice } from '@/lib/utils/format';

const hiddenRoutes = ['/cart', '/checkout', '/admin', '/order-confirmation', '/login', '/register'];

export function CartBar() {
  const pathname = usePathname();
  const { totalItems, totalAmount } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isHiddenRoute = hiddenRoutes.some((route) => pathname.startsWith(route));

  if (!isMounted || isHiddenRoute || totalItems === 0) {
    return null;
  }

  return (
    <>
      {/* Reserva el alto de la barra para que no tape el final de la pagina */}
      <div aria-hidden className="h-20" />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-4 py-3 shadow-[0_-8px_24px_rgba(89,11,49,0.12)] backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">
              {totalItems === 1 ? '1 producto' : `${totalItems} productos`} en tu carrito
            </p>
            <p className="text-lg font-bold text-foreground">
              Total: <span className="text-primary-600">{formatPrice(totalAmount, 'PEN')}</span>
            </p>
          </div>
          <Link
            href="/cart"
            className="inline-flex flex-shrink-0 items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-lg font-semibold text-white shadow-[0_12px_24px_rgba(228,48,140,0.22)] transition-colors hover:bg-primary-700"
          >
            Ir a pagar
            <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
}
