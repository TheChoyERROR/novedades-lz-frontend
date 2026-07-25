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

export async function getProducts(params: {
  page?: number;
  size?: number;
  category?: string;
  sortBy?: string;
  direction?: 'ASC' | 'DESC';
}): Promise<Product[]> {
  const query = new URLSearchParams();
  query.set('page', String(params.page ?? 0));
  query.set('size', String(params.size ?? 12));
  if (params.sortBy) query.set('sortBy', params.sortBy);
  if (params.direction) query.set('direction', params.direction);

  const path = params.category
    ? `/products/category/${encodeURIComponent(params.category)}?${query}`
    : `/products?${query}`;

  try {
    const page = await fetchFromApi<PageResponse<Product>>(path, CATALOG_REVALIDATE_SECONDS);
    return page?.content ?? [];
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
