import type { Metadata } from 'next';
import Link from 'next/link';
import { CatalogSearch, ProductGrid } from '@/components/products';
import { getCatalogPage, getCategories } from '@/lib/api/server';

/**
 * El catalogo se renderiza en el servidor.
 *
 * <p>Antes era un componente de cliente: el HTML llegaba vacio, el navegador pedia los productos y
 * mientras tanto la clienta veia "Cargando productos...". Como la portada redirige aqui, eso era
 * literalmente lo primero que se veia al entrar a la tienda.
 *
 * <p>Ahora el HTML llega con los productos puestos, y buscar o filtrar es una navegacion normal
 * con parametros en la URL: funciona sin JavaScript y cada busqueda queda como enlace compartible.
 */
export const revalidate = 300;

const PAGE_SIZE = 12;

export const metadata: Metadata = {
  title: 'Productos | Novedades LZ',
  description:
    'Mira todo el catalogo de Novedades LZ: novedades, accesorios y regalos con envio a todo el pais.',
  alternates: { canonical: '/products' },
};

interface CatalogPageProps {
  searchParams: Promise<{ q?: string; categoria?: string; pagina?: string }>;
}

export default async function ProductsPage({ searchParams }: CatalogPageProps) {
  const { q, categoria, pagina } = await searchParams;

  const search = q?.trim() || undefined;
  const category = categoria?.trim() || undefined;
  const page = Math.max(0, Number(pagina ?? '1') - 1) || 0;

  const [catalog, categories] = await Promise.all([
    getCatalogPage({ page, size: PAGE_SIZE, search, category }),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">Nuestros Productos</h1>

      <CatalogSearch search={search} categories={categories} activeCategory={category} />

      <ProductGrid
        products={catalog.products}
        emptyMessage={search ? `No encontramos "${search}"` : 'No hay productos disponibles'}
        emptyDescription={
          search
            ? 'Prueba con otra palabra o mira todo el catalogo.'
            : 'Vuelve en un momento, estamos reponiendo.'
        }
      />

      {catalog.totalPages > 1 ? (
        <Pagination
          currentPage={catalog.page}
          totalPages={catalog.totalPages}
          search={search}
          category={category}
        />
      ) : null}
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  search,
  category,
}: {
  currentPage: number;
  totalPages: number;
  search?: string;
  category?: string;
}) {
  const href = (page: number) => {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (category) params.set('categoria', category);
    if (page > 0) params.set('pagina', String(page + 1));

    const query = params.toString();
    return query ? `/products?${query}` : '/products';
  };

  return (
    <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Paginacion">
      {currentPage > 0 ? (
        <Link
          href={href(currentPage - 1)}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:border-primary-300"
        >
          Anterior
        </Link>
      ) : null}

      <span className="text-sm text-muted-foreground">
        Pagina {currentPage + 1} de {totalPages}
      </span>

      {currentPage + 1 < totalPages ? (
        <Link
          href={href(currentPage + 1)}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:border-primary-300"
        >
          Siguiente
        </Link>
      ) : null}
    </nav>
  );
}
