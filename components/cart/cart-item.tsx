'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CartItem as CartItemType } from '@/types';
import { useCartStore } from '@/stores/cart-store';
import { formatPrice } from '@/lib/utils/format';
import { Button } from '@/components/ui';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const { product, quantity } = item;

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < product.stock) {
      updateQuantity(product.id, quantity + 1);
    }
  };

  const handleRemove = () => {
    removeItem(product.id);
  };

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
      {/* Product Image */}
      <Link href={`/products/${product.id}`} className="flex-shrink-0">
        <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="h-8 w-8 text-gray-300"
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
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors truncate">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mt-1">
          {formatPrice(product.price, 'PEN')} c/u
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center border border-gray-300 rounded-lg">
        <button
          onClick={handleDecrement}
          disabled={quantity <= 1}
          className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          -
        </button>
        <span className="px-3 py-1 border-x border-gray-300 min-w-[40px] text-center text-sm">
          {quantity}
        </span>
        <button
          onClick={handleIncrement}
          disabled={quantity >= product.stock}
          className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right min-w-[100px]">
        <span className="font-semibold text-gray-900">
          {formatPrice(product.price * quantity, 'PEN')}
        </span>
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleRemove}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </Button>
    </div>
  );
}
