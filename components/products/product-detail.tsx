'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Badge, Button } from '@/components/ui';
import { formatPrice } from '@/lib/utils/format';
import { useCartStore } from '@/stores/cart-store';
import { Product } from '@/types';
import { ProductImageWatermark } from '@/components/products/product-image-watermark';
import {
  buildProductShareData,
  buildWhatsAppInquiryUrl,
  getAvailability,
} from '@/lib/products/product-messaging';
import {
  getProtectedCloudinaryImageUrl,
  shouldUseOverlayWatermarkFallback,
} from '@/lib/utils/cloudinary-watermark';
import toast from 'react-hot-toast';

interface ProductDetailProps {
  product: Product;
  /**
   * URL canonica del producto, calculada en el servidor. Se recibe como prop en vez de leer
   * window.location: asi es la misma en el HTML y tras hidratar, no arrastra parametros de
   * seguimiento, y no hace falta un efecto para conocerla.
   */
  productUrl: string;
}

export function ProductDetail({ product, productUrl }: ProductDetailProps) {
  const router = useRouter();
  const defaultSelectedImage = product.imageUrls?.[0] ?? product.imageUrl ?? null;
  const defaultSelectedMedia =
    defaultSelectedImage != null
      ? { type: 'image' as const, url: defaultSelectedImage }
      : product.videoUrl
        ? { type: 'video' as const, url: product.videoUrl }
        : null;
  const [quantity, setQuantity] = useState(1);
  const [selectedMedia, setSelectedMedia] = useState<{
    type: 'image' | 'video';
    url: string;
  } | null>(defaultSelectedMedia);
  const { addItem, getItem } = useCartStore();
  const cartItem = getItem(product.id);
  const availability = getAvailability(product);
  const isOutOfStock = availability.isOutOfStock;
  const maxQuantity = product.trackInventory
    ? product.stock - (cartItem?.quantity || 0)
    : 20;
  const productImages = product.imageUrls?.length
    ? product.imageUrls
    : product.imageUrl
      ? [product.imageUrl]
      : [];
  const mediaItems = [
    ...productImages.map((url) => ({ type: 'image' as const, url })),
    ...(product.videoUrl ? [{ type: 'video' as const, url: product.videoUrl }] : []),
  ];
  const activeMedia =
    selectedMedia && mediaItems.some((media) => media.type === selectedMedia.type && media.url === selectedMedia.url)
      ? selectedMedia
      : defaultSelectedMedia;
  const activeImageUrl =
    activeMedia?.type === 'image'
      ? getProtectedCloudinaryImageUrl(activeMedia.url, 'detail')
      : null;
  const showOverlayFallback =
    activeMedia?.type === 'image'
      ? shouldUseOverlayWatermarkFallback(activeMedia.url)
      : false;

  const addCurrentQuantity = (): boolean => {
    if (isOutOfStock) {
      toast.error('Producto agotado');
      return false;
    }

    if (quantity > maxQuantity) {
      toast.error(`Solo quedan ${maxQuantity} unidades disponibles`);
      return false;
    }

    addItem(product, quantity);
    return true;
  };

  const handleAddToCart = () => {
    if (!addCurrentQuantity()) return;
    toast.success(`${quantity} x ${product.name} agregado al carrito`);
    setQuantity(1);
  };

  const handleBuyNow = () => {
    if (!addCurrentQuantity()) return;
    router.push('/checkout');
  };

  const handleShare = async () => {
    const shareData = buildProductShareData(product, productUrl);

    // En celular abre el menu nativo (WhatsApp, Facebook...). En escritorio suele no existir,
    // asi que se copia el enlace, que es lo mas util que se puede ofrecer ahi.
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        // Cancelar el menu de compartir no es un error que valga la pena mostrar.
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(shareData.url);
      toast.success('Enlace copiado');
    } catch {
      toast.error('No pudimos compartir el producto');
    }
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
          {activeMedia?.type === 'image' && activeImageUrl ? (
            <>
              <Image
                src={activeImageUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {showOverlayFallback ? <ProductImageWatermark size="lg" /> : null}
            </>
          ) : activeMedia?.type === 'video' ? (
            <video
              src={activeMedia.url}
              controls
              preload="metadata"
              className="h-full w-full object-contain bg-black"
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

        {mediaItems.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {mediaItems.map((media, index) => (
              <button
                key={`${media.type}-${media.url}-${index}`}
                type="button"
                onClick={() => setSelectedMedia(media)}
                className={`relative aspect-square overflow-hidden rounded-xl border-2 transition ${
                  activeMedia?.type === media.type && activeMedia.url === media.url
                    ? 'border-primary-500 ring-2 ring-primary-200'
                    : 'border-border hover:border-primary-300'
                }`}
              >
                {media.type === 'image' ? (
                  <Image
                    src={getProtectedCloudinaryImageUrl(media.url, 'thumb') ?? media.url}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
                    <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                )}
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
          <Badge variant={availability.tone}>{availability.label}</Badge>
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

        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full"
            variant={isOutOfStock ? 'secondary' : 'primary'}
            disabled={isOutOfStock}
            onClick={handleBuyNow}
          >
            {isOutOfStock ? 'Sin stock' : 'Comprar ahora'}
          </Button>
          {!isOutOfStock && (
            <Button
              size="lg"
              className="w-full"
              variant="outline"
              onClick={handleAddToCart}
            >
              Agregar al carrito y seguir viendo
            </Button>
          )}

          {/* La tienda vende por WhatsApp: quien tiene una duda sobre el producto no tenia
              ningun camino para preguntarla sin salir de la pagina y volver a explicar cual era. */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href={buildWhatsAppInquiryUrl(product, productUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="contents"
            >
              <Button size="lg" variant="outline" className="w-full gap-2">
                <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Consultar
              </Button>
            </a>

            <Button size="lg" variant="outline" className="w-full gap-2" onClick={handleShare}>
              <svg
                className="h-5 w-5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342a3 3 0 100-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.368-2.684 3 3 0 00-5.368 2.684zm0 12.632a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Compartir
            </Button>
          </div>
        </div>

        {/* Antes la clienta se enteraba de las formas de entrega recien en el checkout. */}
        <div className="mt-6 space-y-2 rounded-xl border border-border bg-surface-muted p-4">
          <p className="flex items-start gap-2 text-sm text-foreground">
            <span aria-hidden className="text-primary-600">&#10003;</span>
            <span>
              <strong>Envio gratis</strong> a todo el pais, pagando con Yape
            </span>
          </p>
          <p className="flex items-start gap-2 text-sm text-foreground">
            <span aria-hidden className="text-primary-600">&#10003;</span>
            <span>
              O <strong>recoge en Casa Grande</strong> y paga en efectivo al retirar
            </span>
          </p>
        </div>

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
              <dd className="font-medium text-foreground">{availability.label}</dd>
            </div>
            {product.videoUrl && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Video</dt>
                <dd className="font-medium text-foreground">Disponible</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
