import { Product } from '@/types';
import { formatPrice } from '@/lib/utils/format';
import { WHATSAPP_URL } from '@/lib/orders/fulfillment';

/**
 * Mensajes y disponibilidad de un producto.
 *
 * <p>Son funciones puras a proposito: la logica de que texto llega al WhatsApp de la tienda y de
 * cuando decir "quedan 2" en vez de "disponible" se puede probar sin montar un navegador.
 */

/** Desde cuantas unidades conviene avisar que queda poco. Mismo umbral que usa el backend. */
export const LOW_STOCK_THRESHOLD = 5;

export type AvailabilityTone = 'success' | 'warning' | 'danger';

export interface Availability {
  label: string;
  tone: AvailabilityTone;
  isOutOfStock: boolean;
}

/**
 * Un producto sin control de inventario siempre esta disponible: la tienda repone y no lleva
 * cuenta. Cuando si lo lleva, decir el numero exacto es mas honesto que un "Disponible" plano y
 * ayuda a la clienta a decidir.
 */
export function getAvailability(product: Pick<Product, 'stock' | 'trackInventory'>): Availability {
  if (!product.trackInventory) {
    return { label: 'Disponible', tone: 'success', isOutOfStock: false };
  }

  if (product.stock <= 0) {
    return { label: 'Agotado', tone: 'danger', isOutOfStock: true };
  }

  if (product.stock <= LOW_STOCK_THRESHOLD) {
    return {
      label: product.stock === 1 ? 'Queda 1' : `Quedan ${product.stock}`,
      tone: 'warning',
      isOutOfStock: false,
    };
  }

  return { label: 'Disponible', tone: 'success', isOutOfStock: false };
}

/**
 * Mensaje que la clienta envia a la tienda. Lleva el nombre, el precio y el enlace para que la
 * tienda sepa de que producto se trata sin tener que preguntar.
 */
export function buildWhatsAppInquiryMessage(
  product: Pick<Product, 'name' | 'price'>,
  productUrl: string
): string {
  return [
    `Hola, me interesa "${product.name}" (${formatPrice(product.price, 'PEN')}).`,
    productUrl,
  ].join('\n');
}

export function buildWhatsAppInquiryUrl(
  product: Pick<Product, 'name' | 'price'>,
  productUrl: string
): string {
  const message = buildWhatsAppInquiryMessage(product, productUrl);
  return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
}

export interface ProductShareData {
  title: string;
  text: string;
  url: string;
}

export function buildProductShareData(
  product: Pick<Product, 'name' | 'price'>,
  productUrl: string
): ProductShareData {
  return {
    title: product.name,
    text: `${product.name} - ${formatPrice(product.price, 'PEN')} en Novedades LZ`,
    url: productUrl,
  };
}
