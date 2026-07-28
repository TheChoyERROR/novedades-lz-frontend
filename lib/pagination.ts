/** Opciones de "cuantos mostrar" que comparten los listados del panel y el catalogo. */
export const PAGE_SIZE_OPTIONS = [12, 24, 48, 96] as const;

export const DEFAULT_PAGE_SIZE = 12;

/**
 * Normaliza el tamano que llega de la URL o de un selector manipulado.
 *
 * <p>Sin este tope, un `?mostrar=100000` haria que el backend intente traer el catalogo entero en
 * una sola consulta.
 */
export function normalizePageSize(value: unknown): number {
  const size = Number(value);

  if (!Number.isFinite(size)) {
    return DEFAULT_PAGE_SIZE;
  }

  return (PAGE_SIZE_OPTIONS as readonly number[]).includes(size) ? size : DEFAULT_PAGE_SIZE;
}

/** Convierte el numero de pagina visible (empieza en 1) al indice que espera el backend. */
export function toPageIndex(value: unknown): number {
  const page = Number(value ?? 1);

  if (!Number.isFinite(page) || page < 1) {
    return 0;
  }

  return Math.floor(page) - 1;
}
