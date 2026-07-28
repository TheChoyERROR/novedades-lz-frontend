import type { Metadata } from 'next';
import Link from 'next/link';
import { CatalogSearch, ProductGrid } from '@/components/products';
import { getCatalogPage, getCategories } from '@/lib/api/server';
import { normalizePageSize, PAGE_SIZE_OPTIONS, toPageIndex } from '@/lib/pagination';

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

export const metadata: Metadata = {
  title: 'Productos | Novedades LZ',
  description:
    'Mira todo el catalogo de Novedades LZ: novedades, accesorios y regalos con envio a todo el pais.',
  alternates: { canonical: '/products' },
};

interface CatalogPageProps {
  searchParams: Promise<{ q?: string; categoria?: string; pagina?: string; mostrar?: string }>;
}

export default async function ProductsPage({ searchParams }: CatalogPageProps) {
  const { q, categoria, pagina, mostrar } = await searchParams;

  const search = q?.trim() || undefined;
  const category = categoria?.trim() || undefined;
  const page = toPageIndex(pagina);
  const pageSize = normalizePageSize(mostrar);

  const [catalog, categories] = await Promise.all([
    getCatalogPage({ page, size: pageSize, search, category }),
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
          pageSize={pageSize}
        />
      ) : null}

      {catalog.totalElements > PAGE_SIZE_OPTIONS[0] ? (
        <PageSizePicker
          current={pageSize}
          search={search}
          category={category}
          total={catalog.totalElements}
        />
      ) : null}
    </div>
  );
}

function buildCatalogHref({
  search,
  category,
  page = 0,
  pageSize,
}: {
  search?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}): string {
  const params = new URLSearchParams();
  if (search) params.set('q', search);
  if (category) params.set('categoria', category);
  if (page > 0) params.set('pagina', String(page + 1));
  if (pageSize && pageSize !== PAGE_SIZE_OPTIONS[0]) params.set('mostrar', String(pageSize));

  const query = params.toString();
  return query ? `/products?${query}` : '/products';
}

/** Va al pie, junto a la paginacion: arriba recrearia el muro de filtros que acabamos de quitar. */
function PageSizePicker({
  current,
  search,
  category,
  total,
}: {
  current: number;
  search?: string;
  category?: string;
  total: number;
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
      <span>Mostrar por pagina:</span>
      {PAGE_SIZE_OPTIONS.filter((size) => size <= total || size === PAGE_SIZE_OPTIONS[0]).map(
        (size) => (
          <Link
            key={size}
            href={buildCatalogHref({ search, category, pageSize: size })}
            className={`rounded-full border px-3 py-1 transition-colors ${
              size === current
                ? 'border-primary-600 bg-primary-600 text-white'
                : 'border-border hover:border-primary-300'
            }`}
          >
            {size}
          </Link>
        )
      )}
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  search,
  category,
  pageSize,
}: {
  currentPage: number;
  totalPages: number;
  search?: string;
  category?: string;
  pageSize: number;
}) {
  const href = (page: number) => buildCatalogHref({ search, category, page, pageSize });

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
