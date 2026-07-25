import { renderToBuffer } from '@react-pdf/renderer';
import { getProducts } from '@/lib/api/server';
import { CatalogDocument } from '@/lib/pdf/catalog-document';
import { Product } from '@/types';

/**
 * Genera el catalogo en PDF para compartir por WhatsApp o imprimir.
 *
 * Se genera aqui, en Vercel, y no en el backend de Spring: ese contenedor tiene poca memoria y
 * armar un PDF con fotos es justo el tipo de trabajo que lo tumbaba.
 *
 * Los precios salen siempre del catalogo en vivo, asi que el archivo nunca queda desactualizado.
 */
export const runtime = 'nodejs';
// Puede tardar unos segundos descargando las fotos.
export const maxDuration = 60;

/** Tope de seguridad: evita que un catalogo enorme agote el tiempo de la funcion. */
const MAX_PRODUCTS = 120;

const WHATSAPP_NUMBER = '+51 939 662 630';

/**
 * Cloudinary entrega la foto ya redimensionada, con relleno blanco en vez de recorte para que no
 * se corte el producto. Bajar el peso aqui es lo que hace viable generar el PDF en una funcion.
 */
function toPrintableImageUrl(imageUrl: string): string {
  const marker = '/image/upload/';
  const index = imageUrl.indexOf(marker);

  if (!imageUrl.includes('res.cloudinary.com') || index === -1) {
    return imageUrl;
  }

  const transformation = 'w_600,h_600,c_pad,b_white,f_jpg,q_auto:good';
  return imageUrl.slice(0, index + marker.length) + transformation + '/' + imageUrl.slice(index + marker.length);
}

async function fetchAsDataUri(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) {
      return null;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get('content-type') ?? 'image/jpeg';
    return `data:${contentType};base64,${buffer.toString('base64')}`;
  } catch {
    // Una foto que falla no debe impedir que salga el catalogo completo.
    return null;
  }
}

async function loadProductImages(products: Product[]): Promise<Map<number, string>> {
  const entries = await Promise.all(
    products.map(async (product) => {
      if (!product.imageUrl) {
        return [product.id, null] as const;
      }

      return [product.id, await fetchAsDataUri(toPrintableImageUrl(product.imageUrl))] as const;
    })
  );

  const images = new Map<number, string>();
  for (const [id, dataUri] of entries) {
    if (dataUri) {
      images.set(id, dataUri);
    }
  }

  return images;
}

function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, '');
  }

  const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  return vercelDomain ? `https://${vercelDomain}` : 'http://localhost:3000';
}

export async function GET() {
  const products = await getProducts({ size: MAX_PRODUCTS, sortBy: 'name', direction: 'ASC' });

  if (products.length === 0) {
    return new Response('No hay productos para exportar', { status: 404 });
  }

  const [images, logo] = await Promise.all([
    loadProductImages(products),
    fetchAsDataUri(`${resolveSiteUrl()}/brand/logo.png`),
  ]);

  const generatedOn = new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const buffer = await renderToBuffer(
    <CatalogDocument
      products={products}
      images={images}
      logo={logo}
      whatsappNumber={WHATSAPP_NUMBER}
      generatedOn={generatedOn}
    />
  );

  const fileName = `catalogo-novedades-lz-${new Date().toISOString().slice(0, 10)}.pdf`;

  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      // Se cachea unos minutos para que varias descargas seguidas no vuelvan a bajar las fotos.
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600',
    },
  });
}
