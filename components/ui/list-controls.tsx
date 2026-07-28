'use client';

import { PAGE_SIZE_OPTIONS } from '@/lib/pagination';

interface ListToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSubmit: () => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  placeholder?: string;
  children?: React.ReactNode;
}

/**
 * Buscador, selector de cuantos elementos mostrar y filtros extra de un listado del panel.
 *
 * <p>Se comparte entre productos y pedidos para que ambos se comporten igual: los dos traian 100
 * elementos de golpe y sin paginar, asi que dejaban de funcionar en silencio al pasar de ese
 * numero.
 */
export function ListToolbar({
  search,
  onSearchChange,
  onSubmit,
  pageSize,
  onPageSizeChange,
  placeholder = 'Buscar...',
  children,
}: ListToolbarProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
    >
      <div className="flex min-w-0 flex-1 gap-2">
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          Buscar
        </button>
      </div>

      {children}

      <label className="flex items-center gap-2 text-sm text-gray-600">
        Mostrar
        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>
    </form>
  );
}

interface PaginationBarProps {
  page: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

export function PaginationBar({
  page,
  totalPages,
  totalElements,
  onPageChange,
  itemLabel = 'resultados',
}: PaginationBarProps) {
  if (totalElements === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Paginacion"
      className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row"
    >
      <p className="text-sm text-gray-600">
        {totalElements} {itemLabel}
        {totalPages > 1 ? ` · pagina ${page + 1} de ${totalPages}` : ''}
      </p>

      {totalPages > 1 ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 0}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page + 1 >= totalPages}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      ) : null}
    </nav>
  );
}
