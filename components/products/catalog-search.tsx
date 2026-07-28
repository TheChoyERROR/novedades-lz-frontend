import Link from 'next/link';

interface CatalogSearchProps {
  /** Texto buscado actualmente, para dejarlo escrito en la caja. */
  search?: string;
  categories: string[];
  activeCategory?: string;
}

/**
 * Buscador y categorias del catalogo.
 *
 * <p>Es un componente de servidor a proposito: el formulario navega con GET y los filtros son
 * enlaces, asi que funciona sin JavaScript y no obliga a hidratar el listado. Antes esto era un
 * panel con cuatro controles que ocupaba el 74% de la primera pantalla en celular, de modo que la
 * clienta abria la tienda y casi no veia productos.
 *
 * <p>Se quitaron "Ordenar por" y "Direccion": eran vocabulario de programador ("Descendente") para
 * una decision que nadie pidio tomar. El catalogo muestra siempre lo mas reciente primero.
 */
export function CatalogSearch({ search, categories, activeCategory }: CatalogSearchProps) {
  // El filtro de categoria solo aparece si de verdad hay entre que elegir.
  const showCategories = categories.length > 1;

  return (
    <div className="mb-5 space-y-3">
      <form method="get" action="/products" className="flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={search ?? ''}
          placeholder="Buscar productos..."
          aria-label="Buscar productos"
          className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
        {activeCategory ? (
          <input type="hidden" name="categoria" value={activeCategory} />
        ) : null}
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-primary-600 px-5 py-3 font-medium text-white transition-colors hover:bg-primary-700"
        >
          Buscar
        </button>
      </form>

      {showCategories ? (
        <div className="flex flex-wrap gap-2">
          <CategoryChip label="Todo" href={buildHref({ search })} active={!activeCategory} />
          {categories.map((category) => (
            <CategoryChip
              key={category}
              label={category}
              href={buildHref({ search, category })}
              active={category === activeCategory}
            />
          ))}
        </div>
      ) : null}

      {search ? (
        <p className="text-sm text-muted-foreground">
          Resultados para <strong className="text-foreground">{search}</strong>{' '}
          <Link href="/products" className="text-primary-600 underline">
            Ver todo
          </Link>
        </p>
      ) : null}
    </div>
  );
}

function CategoryChip({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-4 py-2 text-sm transition-colors ${
        active
          ? 'border-primary-600 bg-primary-600 text-white'
          : 'border-border bg-surface text-muted-foreground hover:border-primary-300'
      }`}
    >
      {label}
    </Link>
  );
}

function buildHref({ search, category }: { search?: string; category?: string }): string {
  const params = new URLSearchParams();
  if (search) params.set('q', search);
  if (category) params.set('categoria', category);

  const query = params.toString();
  return query ? `/products?${query}` : '/products';
}
