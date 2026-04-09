'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Badge, Button } from '@/components/ui';
import { formatPrice } from '@/lib/utils/format';
import { useCartStore } from '@/stores/cart-store';
import { Product } from '@/types';
import toast from 'react-hot-toast';

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const defaultSelectedImage = product.imageUrls?.[0] ?? product.imageUrl ?? null;
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(defaultSelectedImage);
  const { addItem, getItem } = useCartStore();
  const cartItem = getItem(product.id);
  const isOutOfStock = product.stock === 0;
  const maxQuantity = product.stock - (cartItem?.quantity || 0);
  const productImages = product.imageUrls?.length
    ? product.imageUrls
    : product.imageUrl
      ? [product.imageUrl]
      : [];
  const activeImage =
    selectedImage && productImages.includes(selectedImage)
      ? selectedImage
      : defaultSelectedImage;

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
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-surface-muted shadow-[0_16px_36px_rgba(89,11,49,0.08)]">
          {activeImage ? (
            <Image
              src={activeImage}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="h-32 w-32 text-muted-foreground"
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
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="rounded-lg bg-danger-500 px-6 py-3 text-xl font-semibold text-white">
                Agotado
              </span>
            </div>
          )}
        </div>

        {productImages.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {productImages.map((imageUrl, index) => (
              <button
                key={`${imageUrl}-${index}`}
                type="button"
                onClick={() => setSelectedImage(imageUrl)}
                className={`relative aspect-square overflow-hidden rounded-xl border-2 transition ${
                  activeImage === imageUrl
                    ? 'border-primary-500 ring-2 ring-primary-200'
                    : 'border-border hover:border-primary-300'
                }`}
              >
                <Image
                  src={imageUrl}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="mb-4">
          <Badge variant="info">{product.category}</Badge>
        </div>

        <h1 className="mb-4 text-3xl font-bold text-foreground">{product.name}</h1>

        <p className="mb-6 text-lg text-muted-foreground">{product.description}</p>

        <div className="mb-6 flex items-center gap-4">
          <span className="text-3xl font-bold text-primary-600">
            {formatPrice(product.price, 'PEN')}
          </span>
          <Badge
            variant={
              product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'danger'
            }
          >
            {product.stock > 0 ? `${product.stock} en stock` : 'Sin stock'}
          </Badge>
        </div>

        {!isOutOfStock && (
          <div className="mb-6 flex items-center gap-4">
            <span className="font-medium text-foreground">Cantidad:</span>
            <div className="flex items-center overflow-hidden rounded-lg border border-border bg-surface">
              <button
                type="button"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="px-4 py-2 text-muted-foreground hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                -
              </button>
              <span className="min-w-[60px] border-x border-border px-4 py-2 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={incrementQuantity}
                disabled={quantity >= maxQuantity}
                className="px-4 py-2 text-muted-foreground hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                +
              </button>
            </div>
            {cartItem && (
              <span className="text-sm text-muted-foreground">
                ({cartItem.quantity} en carrito)
              </span>
            )}
          </div>
        )}

        <Button
          size="lg"
          className="w-full"
          variant={isOutOfStock ? 'secondary' : 'primary'}
          disabled={isOutOfStock}
          onClick={handleAddToCart}
        >
          {isOutOfStock ? 'Sin stock' : 'Agregar al carrito'}
        </Button>

        <div className="mt-8 border-t border-border pt-6">
          <h3 className="mb-4 font-semibold text-foreground">
            Informacion del producto
          </h3>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">SKU</dt>
              <dd className="font-medium text-foreground">
                LZ-{product.id.toString().padStart(6, '0')}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Categoria</dt>
              <dd className="font-medium text-foreground">{product.category}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Disponibilidad</dt>
              <dd className="font-medium text-foreground">
                {product.stock > 0 ? 'En stock' : 'Agotado'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
