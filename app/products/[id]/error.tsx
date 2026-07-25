'use client';

import Link from 'next/link';
import { BackendStatusNotice, buttonClasses } from '@/components/ui';

/**
 * Se muestra cuando el backend no responde al generar la pagina. Una vez generada, Next sigue
 * sirviendo la version en cache aunque Render este caido, asi que esto solo aparece la primera vez
 * que se visita un producto con el backend abajo.
 */
export default function ProductDetailError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <BackendStatusNotice
        variant="error"
        title="No pudimos cargar el producto"
        message="Puede que la tienda se este reactivando. Intenta otra vez en unos segundos."
        onRetry={reset}
      />
      <div className="mt-6 text-center">
        <Link href="/products" className={buttonClasses({ variant: 'outline' })}>
          Ver todos los productos
        </Link>
      </div>
    </div>
  );
}
