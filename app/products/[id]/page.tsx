'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/types';
import { productService } from '@/services/product.service';
import { ProductDetail, ProductGrid } from '@/components/products';
import { Button, LoadingScreen } from '@/components/ui';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId || isNaN(productId)) {
        setError('Producto no encontrado');
        setIsLoading(false);
        return;
      }

      try {
        const productData = await productService.getProductById(productId);
        setProduct(productData);

        // Fetch related products from same category
        if (productData.category) {
          const related = await productService.getProductsByCategory(
            productData.category,
            { page: 0, size: 4 }
          );
          setRelatedProducts(
            related.content.filter((p: Product) => p.id !== productId).slice(0, 4)
          );
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('No se pudo cargar el producto');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !product) {
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            {error || 'Producto no encontrado'}
          </h2>
          <p className="mt-2 text-gray-600">
            El producto que buscas no existe o fue eliminado.
          </p>
          <Link href="/products" className="inline-block mt-6">
            <Button>Ver Todos los Productos</Button>
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
            <Link href="/products" className="text-gray-500 hover:text-indigo-600">
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
