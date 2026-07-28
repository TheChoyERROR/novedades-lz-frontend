'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { Card, CardContent, Button } from '@/components/ui';
import { formatPrice } from '@/lib/utils/format';
import { useCartStore } from '@/stores/cart-store';
import { getAvailability } from '@/lib/products/product-messaging';
import { useSiteStore } from '@/stores/site-store';
import { ProductImageWatermark } from '@/components/products/product-image-watermark';
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
  const { campaign } = useSiteStore();
  const cartItem = getItem(product.id);
  const availability = getAvailability(product);
  const isOutOfStock = availability.isOutOfStock;
  const displayImageUrl = getProtectedCloudinaryImageUrl(product.imageUrl, 'card');
  const showOverlayFallback = shouldUseOverlayWatermarkFallback(product.imageUrl);
  const showCampaignPromo = campaign.enabled && campaign.cardBadge;

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
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-surface-muted">
          {displayImageUrl ? (
            <>
              <Image
                src={displayImageUrl}
                alt={product.name}
                fill
                // Sin esto Next asume 100vw y descarga una imagen de ancho completo para una
                // celda de ~170px. Los valores siguen los breakpoints del grid.
                sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 25vw"
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

          {showCampaignPromo ? (
            <span className="absolute right-2 top-2 rounded-full bg-primary-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
              {campaign.cardBadge}
            </span>
          ) : null}

          {product.videoUrl && (
            <span
              className={`absolute right-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white shadow-sm ${
                showCampaignPromo ? 'top-10' : 'top-2'
              }`}
            >
              Video
            </span>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white sm:px-4 sm:py-2 sm:text-base">
                Agotado
              </span>
            </div>
          )}

          <span className="absolute left-1.5 top-1.5 max-w-[60%] truncate rounded-full bg-primary-600 px-2 py-0.5 text-[10px] text-white shadow-sm sm:left-2 sm:top-2 sm:px-2 sm:py-1 sm:text-xs">
            {product.category}
          </span>
        </div>
      </Link>

      <CardContent className="p-3 sm:p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="line-clamp-2 font-semibold text-foreground transition-colors group-hover:text-primary-600">
            {product.name}
          </h3>
        </Link>

        {/* line-clamp-2 tambien define display, asi que pelea con `hidden` en el mismo elemento:
            el contenedor decide la visibilidad y el parrafo solo recorta el texto. */}
        <div className="hidden md:block">
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {product.description}
          </p>
        </div>

        <div className="mt-3 flex flex-col gap-0.5 sm:mt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          <span className="text-lg font-bold text-primary-600 sm:text-xl">
            {formatPrice(product.price, 'PEN')}
          </span>
          <span
            className={`text-xs sm:text-sm ${
              availability.tone === 'warning' ? 'font-medium text-amber-600' : 'text-muted-foreground'
            }`}
          >
            {availability.label}
          </span>
        </div>

        {showCampaignPromo && campaign.discountLabel ? (
          <p className="mt-2 text-xs font-semibold text-primary-600">
            {campaign.discountLabel} {campaign.name}
          </p>
        ) : null}

        <Button
          className="mt-3 w-full px-2 text-sm sm:mt-4 sm:text-base"
          variant={isOutOfStock ? 'secondary' : 'primary'}
          disabled={isOutOfStock}
          onClick={handleAddToCart}
        >
          {isOutOfStock ? 'Sin stock' : (
            <>
              <span className="sm:hidden">Agregar</span>
              <span className="hidden sm:inline">Agregar al Carrito</span>
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}