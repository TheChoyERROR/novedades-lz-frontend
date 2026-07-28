import { describe, expect, it } from 'vitest';
import {
  buildProductShareData,
  buildWhatsAppInquiryMessage,
  buildWhatsAppInquiryUrl,
  getAvailability,
} from './product-messaging';

const PRODUCT_URL = 'https://www.novedadezlz.shop/products/144';

describe('getAvailability', () => {
  it('trata como disponible lo que no lleva control de inventario', () => {
    // La mayoria del catalogo esta asi: la tienda repone y no lleva la cuenta.
    expect(getAvailability({ stock: 0, trackInventory: false })).toEqual({
      label: 'Disponible',
      tone: 'success',
      isOutOfStock: false,
    });
  });

  it('avisa cuando queda poco, con el numero exacto', () => {
    expect(getAvailability({ stock: 3, trackInventory: true })).toEqual({
      label: 'Quedan 3',
      tone: 'warning',
      isOutOfStock: false,
    });
  });

  it('usa singular cuando queda una sola unidad', () => {
    expect(getAvailability({ stock: 1, trackInventory: true }).label).toBe('Queda 1');
  });

  it('no avisa de escasez cuando hay stock de sobra', () => {
    expect(getAvailability({ stock: 40, trackInventory: true })).toEqual({
      label: 'Disponible',
      tone: 'success',
      isOutOfStock: false,
    });
  });

  it('marca agotado en cero', () => {
    expect(getAvailability({ stock: 0, trackInventory: true })).toEqual({
      label: 'Agotado',
      tone: 'danger',
      isOutOfStock: true,
    });
  });

  it('no deja pasar como disponible un stock negativo', () => {
    expect(getAvailability({ stock: -2, trackInventory: true }).isOutOfStock).toBe(true);
  });
});

describe('buildWhatsAppInquiryMessage', () => {
  it('incluye nombre, precio y enlace para que la tienda no tenga que preguntar', () => {
    const message = buildWhatsAppInquiryMessage(
      { name: 'Antiestres Kpop', price: 6 },
      PRODUCT_URL
    );

    expect(message).toContain('Antiestres Kpop');
    expect(message).toContain('S/');
    expect(message).toContain('6.00');
    expect(message).toContain(PRODUCT_URL);
  });

  it('escapa el mensaje al armar la URL de WhatsApp', () => {
    const url = buildWhatsAppInquiryUrl({ name: 'Kit Regia & Co', price: 20 }, PRODUCT_URL);

    expect(url.startsWith('https://wa.me/')).toBe(true);
    // Sin escapar, un "&" en el nombre cortaria el mensaje en WhatsApp.
    expect(url).toContain('%26');
    expect(url).not.toContain('Kit Regia & Co');
  });

  it('conserva el salto de linea entre el texto y el enlace', () => {
    const url = buildWhatsAppInquiryUrl({ name: 'Vincha', price: 15 }, PRODUCT_URL);
    expect(url).toContain('%0A');
  });
});

describe('buildProductShareData', () => {
  it('arma titulo, texto y enlace para el menu de compartir del celular', () => {
    const data = buildProductShareData({ name: 'Joyero Gaby', price: 12 }, PRODUCT_URL);

    expect(data.title).toBe('Joyero Gaby');
    expect(data.text).toContain('Joyero Gaby');
    expect(data.text).toContain('Novedades LZ');
    expect(data.url).toBe(PRODUCT_URL);
  });
});
