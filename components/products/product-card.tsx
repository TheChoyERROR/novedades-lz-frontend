'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { Card, CardContent, Button } from '@/components/ui';
import { formatPrice } from '@/lib/utils/format';
import { useCartStore } from '@/stores/cart-store';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, getItem } = useCartStore();
  const cartItem = getItem(product.id);
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error('Producto agotado');
      return;
    }

    if (cartItem && cartItem.quantity >= product.stock) {
      toast.error('No hay más stock disponible');
      return;
    }

    addItem(product);
    toast.success(`${product.name} agregado al carrito`);
  };

  return (
    <Card className="group overflow-hidden">
      {/* Product Image */}
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="h-20 w-20 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Out of Stock Badge */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
                Agotado
              </span>
            </div>
          )}

          {/* Category Badge */}
          <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-indigo-600">
            {formatPrice(product.price, 'PEN')}
          </span>
          <span className="text-sm text-gray-500">
            Stock: {product.stock}
          </span>
        </div>

        <Button
          className="w-full mt-4"
          variant={isOutOfStock ? 'secondary' : 'primary'}
          disabled={isOutOfStock}
          onClick={handleAddToCart}
        >
          {isOutOfStock ? 'Sin Stock' : 'Agregar al Carrito'}
        </Button>
      </CardContent>
    </Card>
  );
}
