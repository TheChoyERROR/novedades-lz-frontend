'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Product } from '@/types';
import { Button, Badge } from '@/components/ui';
import { formatPrice } from '@/lib/utils/format';
import { useCartStore } from '@/stores/cart-store';
import toast from 'react-hot-toast';

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem, getItem } = useCartStore();
  const cartItem = getItem(product.id);
  const isOutOfStock = product.stock === 0;
  const maxQuantity = product.stock - (cartItem?.quantity || 0);

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error('Producto agotado');
      return;
    }

    if (quantity > maxQuantity) {
      toast.error(`Solo quedan ${maxQuantity} unidades disponibles`);
      return;
    }

    addItem(product, quantity);
    toast.success(`${quantity} x ${product.name} agregado al carrito`);
    setQuantity(1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const incrementQuantity = () => {
    if (quantity < maxQuantity) setQuantity(quantity + 1);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="h-32 w-32 text-gray-300"
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

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold text-xl">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div>
        <div className="mb-4">
          <Badge variant="info">{product.category}</Badge>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {product.name}
        </h1>

        <p className="text-gray-600 text-lg mb-6">
          {product.description}
        </p>

        <div className="flex items-center gap-4 mb-6">
          <span className="text-3xl font-bold text-indigo-600">
            {formatPrice(product.price, 'PEN')}
          </span>
          <Badge variant={product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'danger'}>
            {product.stock > 0 ? `${product.stock} en stock` : 'Sin stock'}
          </Badge>
        </div>

        {/* Quantity Selector */}
        {!isOutOfStock && (
          <div className="flex items-center gap-4 mb-6">
            <span className="text-gray-700 font-medium">Cantidad:</span>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
              <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                {quantity}
              </span>
              <button
                onClick={incrementQuantity}
                disabled={quantity >= maxQuantity}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
            {cartItem && (
              <span className="text-sm text-gray-500">
                ({cartItem.quantity} en carrito)
              </span>
            )}
          </div>
        )}

        {/* Add to Cart Button */}
        <Button
          size="lg"
          className="w-full"
          variant={isOutOfStock ? 'secondary' : 'primary'}
          disabled={isOutOfStock}
          onClick={handleAddToCart}
        >
          {isOutOfStock ? 'Sin Stock' : 'Agregar al Carrito'}
        </Button>

        {/* Additional Info */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="font-semibold text-gray-900 mb-4">Información del Producto</h3>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-gray-500">SKU</dt>
              <dd className="text-gray-900 font-medium">LZ-{product.id.toString().padStart(6, '0')}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Categoría</dt>
              <dd className="text-gray-900 font-medium">{product.category}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Disponibilidad</dt>
              <dd className="text-gray-900 font-medium">
                {product.stock > 0 ? 'En stock' : 'Agotado'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
