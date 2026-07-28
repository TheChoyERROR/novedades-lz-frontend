import { ApiResponse, PageResponse, Product } from '@/types';

/**
 * Acceso al backend desde el servidor (Server Components y generateMetadata).
 *
 * No reutiliza el cliente de axios porque ese lee el token de localStorage, que no existe en el
 * servidor. Aqui solo se consultan endpoints publicos de catalogo, con `fetch` nativo para
 * aprovechar el cache incremental de Next: la pagina se genera una vez y se sirve desde el CDN de
 * Vercel, sin volver a golpear Render en cada visita.
 */

/** Cada cuantos segundos se regenera una pagina de catalogo en segundo plano. */
export const CATALOG_REVALIDATE_SECONDS = 300;

/**
 * En el servidor la URL tiene que ser absoluta: el `/api` relativo del navegador no significa nada
 * aqui. API_BASE_URL permite apuntar directo a Render sin exponerlo al bundle del cliente.
 */
function resolveServerApiBaseUrl(): string | null {
  const candidates = [process.env.API_BASE_URL, process.env.NEXT_PUBLIC_API_BASE_URL];

  for (const candidate of candidates) {
    const value = candidate?.trim();
    if (value && /^https?:\/\//i.test(value)) {
      return value.replace(/\/$/, '');
    }
  }

  return null;
}

class BackendUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BackendUnavailableError';
  }
}

async function fetchFromApi<T>(path: string, revalidate: number): Promise<T | null> {
  const baseUrl = resolveServerApiBaseUrl();

  if (!baseUrl) {
    // Sin URL absoluta no se puede renderizar en servidor. Se avisa y la pagina cae al
    // renderizado en cliente en vez de romperse.
    console.warn(
      '[server-api] Falta API_BASE_URL (o NEXT_PUBLIC_API_BASE_URL absoluta). ' +
        'El catalogo no se podra renderizar en el servidor.'
    );
    return null;
  }

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      next: { revalidate },
      headers: { Accept: 'application/json' },
    });
  } catch (error) {
    throw new BackendUnavailableError(
      `No se pudo contactar al backend: ${error instanceof Error ? error.message : 'error de red'}`
    );
  }

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new BackendUnavailableError(`El backend respondio ${response.status} en ${path}`);
  }

  const body = (await response.json()) as ApiResponse<T>;
  return body.data ?? null;
}

export async function getProductById(id: number): Promise<Product | null> {
  if (!Number.isFinite(id) || id <= 0) {
    return null;
  }

  return fetchFromApi<Product>(`/products/${id}`, CATALOG_REVALIDATE_SECONDS);
}

export interface CatalogQuery {
  page?: number;
  size?: number;
  category?: string;
  search?: string;
}

export interface CatalogPage {
  products: Product[];
  page: number;
  totalPages: number;
  totalElements: number;
}

/**
 * Una pagina del catalogo. Devuelve el total de paginas porque el listado se pagina con enlaces
 * renderizados en el servidor, no con estado en el navegador.
 */
export async function getCatalogPage(params: CatalogQuery): Promise<CatalogPage> {
  const query = new URLSearchParams();
  query.set('page', String(params.page ?? 0));
  query.set('size', String(params.size ?? 12));
  if (params.search) query.set('search', params.search);

  const path = params.category
    ? `/products/category/${encodeURIComponent(params.category)}?${query}`
    : `/products?${query}`;

  const result = await fetchFromApi<PageResponse<Product>>(path, CATALOG_REVALIDATE_SECONDS);

  return {
    products: result?.content ?? [],
    page: result?.number ?? 0,
    totalPages: result?.totalPages ?? 0,
    totalElements: result?.totalElements ?? 0,
  };
}

/** Nombres de categoria presentes en el catalogo, para ofrecer el filtro solo si hay mas de una. */
export async function getCategories(): Promise<string[]> {
  try {
    const page = await getCatalogPage({ size: 100 });
    const names = page.products
      .map((product) => product.category)
      .filter((category): category is string => Boolean(category?.trim()));

    return [...new Set(names)].sort((a, b) => a.localeCompare(b, 'es'));
  } catch {
    return [];
  }
}

export async function getProducts(params: {
  page?: number;
  size?: number;
  category?: string;
  search?: string;
}): Promise<Product[]> {
  try {
    return (await getCatalogPage(params)).products;
  } catch {
    // Los listados secundarios (relacionados, destacados) no deben tumbar la pagina entera.
    return [];
  }
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  if (!product.category) {
    return [];
  }

  const related = await getProducts({ category: product.category, size: limit + 1 });
  return related.filter((candidate) => candidate.id !== product.id).slice(0, limit);
}
