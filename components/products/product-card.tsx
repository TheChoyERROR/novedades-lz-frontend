'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { Card, CardContent, Button } from '@/components/ui';
import { formatPrice } from '@/lib/utils/format';
import { useCartStore } from '@/stores/cart-store';
import { ProductImageWatermark } from '@/components/products/product-image-watermark';
import { cybermomCampaign, isCybermomCampaignActive } from '@/lib/campaigns/cybermom';
import {
  getProtectedCloudinaryImageUrl,
  shouldUseOverlayWatermarkFallback,
} from '@/lib/utils/cloudinary-watermark';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, getItem } = useCartStore();
  const cartItem = getItem(product.id);
  const isOutOfStock = product.trackInventory && product.stock === 0;
  const displayImageUrl = getProtectedCloudinaryImageUrl(product.imageUrl, 'card');
  const showOverlayFallback = shouldUseOverlayWatermarkFallback(product.imageUrl);
  const showCybermomPromo = isCybermomCampaignActive();

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error('Producto agotado');
      return;
    }

    if (product.trackInventory && cartItem && cartItem.quantity >= product.stock) {
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
        <div className="relative aspect-square overflow-hidden bg-surface-muted">
          {displayImageUrl ? (
            <>
              <Image
                src={displayImageUrl}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {showOverlayFallback ? <ProductImageWatermark /> : null}
            </>
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

          {showCybermomPromo ? (
            <span className="absolute right-2 top-2 rounded-full bg-[#e25664] px-2.5 py-1 text-xs font-bold text-white shadow-sm dark:bg-[#ff7a86] dark:text-[#19090d]">
              {cybermomCampaign.cardBadge}
            </span>
          ) : null}

          {product.videoUrl && (
            <span
              className={`absolute right-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white shadow-sm ${
                showCybermomPromo ? 'top-10' : 'top-2'
              }`}
            >
              Video
            </span>
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
          <span className="absolute left-2 top-2 max-w-[calc(100%-8.5rem)] truncate rounded-full bg-primary-600 px-2 py-1 text-xs text-white shadow-sm">
            {product.category}
          </span>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="line-clamp-2 font-semibold text-foreground transition-colors group-hover:text-primary-600">
            {product.name}
          </h3>
        </Link>

        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-primary-600">
            {formatPrice(product.price, 'PEN')}
          </span>
          <span className="text-sm text-muted-foreground">
            {product.trackInventory ? (isOutOfStock ? 'Agotado' : 'Disponible') : 'Disponible'}
          </span>
        </div>

        {showCybermomPromo ? (
          <p className="mt-2 text-xs font-semibold text-[#b74450] dark:text-[#ff8d98]">
            {cybermomCampaign.discountLabel} Cybermom hasta el 10 de mayo
          </p>
        ) : null}

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
