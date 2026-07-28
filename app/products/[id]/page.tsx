import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductDetail, ProductGrid } from '@/components/products';
import { getProductById, getRelatedProducts } from '@/lib/api/server';
import { formatPrice } from '@/lib/utils/format';
import { getOpenGraphImageUrl, OG_IMAGE_SIZE } from '@/lib/utils/og-image';
import { buildProductUrl } from '@/lib/site-url';

/**
 * Esta pagina se renderiza en el servidor y se regenera cada pocos minutos.
 *
 * Antes era un componente de cliente: el HTML llegaba vacio y los datos se pedian desde el
 * navegador. Eso significaba que compartir un producto por WhatsApp no mostraba ninguna
 * previsualizacion (los rastreadores no ejecutan JavaScript) y que cada visita esperaba a Render.
 * Ahora el HTML llega completo desde el CDN de Vercel y el backend solo se consulta al regenerar.
 */
// Next analiza este valor estaticamente, asi que tiene que ser un literal (5 minutos).
export const revalidate = 300;

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(Number(id));

  if (!product) {
    return { title: 'Producto no encontrado | Novedades LZ' };
  }

  const title = `${product.name} | Novedades LZ`;
  const price = formatPrice(product.price, 'PEN');
  const description = product.description?.trim()
    ? `${price} - ${product.description.trim().slice(0, 150)}`
    : `${product.name} por ${price} en Novedades LZ. Envio rapido y atencion por WhatsApp.`;

  const ogImage = getOpenGraphImageUrl(product.imageUrl);

  return {
    title,
    description,
    alternates: { canonical: `/products/${product.id}` },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'es_PE',
      siteName: 'Novedades LZ',
      url: `/products/${product.id}`,
      images: ogImage ? [{ url: ogImage, ...OG_IMAGE_SIZE, alt: product.name }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(Number(id));

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link href="/" className="text-gray-500 hover:text-primary-600">
              Inicio
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <Link href="/products" className="text-gray-500 hover:text-primary-600">
              Productos
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 font-medium truncate max-w-xs">{product.name}</li>
        </ol>
      </nav>

      <ProductDetail product={product} productUrl={buildProductUrl(product.id)} />

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Productos Relacionados</h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}

      {/* Datos estructurados para que Google muestre precio y disponibilidad en los resultados. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description ?? undefined,
            image: product.imageUrls?.length ? product.imageUrls : undefined,
            category: product.category ?? undefined,
            offers: {
              '@type': 'Offer',
              price: product.price,
              priceCurrency: 'PEN',
              availability:
                product.trackInventory && product.stock <= 0
                  ? 'https://schema.org/OutOfStock'
                  : 'https://schema.org/InStock',
            },
          }),
        }}
      />
    </div>
  );
}
