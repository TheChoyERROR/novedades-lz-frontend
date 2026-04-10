'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/types';
import { productService } from '@/services/product.service';
import { ProductDetail, ProductGrid } from '@/components/products';
import {
  ApiAvailabilityState,
  BACKEND_RETRY_DELAY_MS,
  isBackendUnavailableError,
} from '@/lib/api/client';
import { BackendStatusNotice, Button } from '@/components/ui';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadState, setLoadState] = useState<ApiAvailabilityState>('loading');
  const [error, setError] = useState<string | null>(null);
  const [retryTick, setRetryTick] = useState(0);
  const [warmupAttempts, setWarmupAttempts] = useState(0);

  useEffect(() => {
    let isCancelled = false;
    let retryTimeout: number | undefined;

    const fetchProduct = async () => {
      if (!productId || isNaN(productId)) {
        setError('Producto no encontrado');
        setLoadState('error');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setLoadState((current) => (current === 'warming_up' ? current : 'loading'));
      setError(null);

      try {
        const productData = await productService.getProductById(productId);
        if (isCancelled) {
          return;
        }

        setProduct(productData);

        // Fetch related products from same category
        if (productData.category) {
          try {
            const related = await productService.getProductsByCategory(
              encodeURIComponent(productData.category),
              { page: 0, size: 4 }
            );
            setRelatedProducts(
              related.content.filter((p: Product) => p.id !== productId).slice(0, 4)
            );
          } catch {
            // console.warn('Failed to load related products:', relatedError);
            // Don't fail the whole page if related products fail
          }
        }
        setLoadState('ready');
        setWarmupAttempts(0);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        console.error('Error fetching product:', error);

        if (isBackendUnavailableError(error)) {
          setLoadState('warming_up');
          setWarmupAttempts((current) => current + 1);
          retryTimeout = window.setTimeout(() => {
            setRetryTick((current) => current + 1);
          }, BACKEND_RETRY_DELAY_MS);
          return;
        }

        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setError('Producto no encontrado');
        } else {
          setError('No se pudo cargar el producto');
        }

        setLoadState('error');
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void fetchProduct();

    return () => {
      isCancelled = true;

      if (retryTimeout) {
        window.clearTimeout(retryTimeout);
      }
    };
  }, [productId, retryTick]);

  const handleRetry = () => {
    setWarmupAttempts(0);
    setLoadState('loading');
    setRetryTick((current) => current + 1);
  };

  if (isLoading || loadState === 'warming_up') {
    const title =
      warmupAttempts > 1
        ? 'El producto ya casi esta listo'
        : 'Estamos conectando con la ficha del producto';

    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <BackendStatusNotice
          className="w-full"
          title={title}
          message="Si el backend estaba inactivo, puede tardar unos segundos en arrancar. Seguimos intentando por ti."
          onRetry={handleRetry}
        />
      </div>
    );
  }

  if (error || !product) {
    const isNotFound = error === 'Producto no encontrado';

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {isNotFound ? (
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
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">{error}</h2>
            <p className="mt-2 text-gray-600">
              El producto que buscas no existe o fue eliminado.
            </p>
            <Link href="/products" className="mt-6 inline-block">
              <Button>Ver Todos los Productos</Button>
            </Link>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl">
            <BackendStatusNotice
              variant="error"
              title="No pudimos cargar el producto"
              message="Puedes intentar otra vez en un momento. Si el backend se estaba reactivando, normalmente entra en el siguiente intento."
              onRetry={handleRetry}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link href="/" className="text-gray-500 hover:text-primary-600">
              Inicio
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <Link href="/products" className="text-gray-500 hover:text-primary-600">
              Productos
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 font-medium truncate max-w-xs">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Product Detail */}
      <ProductDetail product={product} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Productos Relacionados
          </h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
}
