/**
 * Imagenes para previsualizaciones de enlaces (WhatsApp, Facebook, Twitter).
 *
 * WhatsApp es el canal de venta principal de la tienda y es exigente: descarta imagenes muy
 * pesadas y recorta lo que no tenga proporcion cercana a 1.91:1. Por eso, cuando la imagen esta en
 * Cloudinary, se pide una version de 1200x630 rellenada sobre fondo en vez de recortada, para que
 * no se corte el producto.
 */

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

export const OG_IMAGE_SIZE = { width: OG_WIDTH, height: OG_HEIGHT } as const;

function isCloudinaryImageUrl(url: string): boolean {
  return url.includes('res.cloudinary.com') && url.includes('/image/upload/');
}

export function getOpenGraphImageUrl(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) {
    return null;
  }

  if (!isCloudinaryImageUrl(imageUrl)) {
    // Las URLs locales (/uploads/...) ya son absolutas; se usan tal cual.
    return imageUrl;
  }

  const uploadMarker = '/image/upload/';
  const uploadIndex = imageUrl.indexOf(uploadMarker);

  if (uploadIndex === -1) {
    return imageUrl;
  }

  const transformation = [
    `w_${OG_WIDTH}`,
    `h_${OG_HEIGHT}`,
    'c_pad',
    'b_auto',
    'f_jpg',
    'q_auto:good',
  ].join(',');

  return (
    imageUrl.slice(0, uploadIndex + uploadMarker.length) +
    transformation +
    '/' +
    imageUrl.slice(uploadIndex + uploadMarker.length)
  );
}
