'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types';
import { productService } from '@/services/product.service';
import { ProductFilters, ProductGrid } from '@/components/products';
import { BackendStatusNotice, Button } from '@/components/ui';
import {
  ApiAvailabilityState,
  BACKEND_RETRY_DELAY_MS,
  isBackendUnavailableError,
} from '@/lib/api/client';

interface FilterValues {
  category: string;
  sortBy: string;
  direction: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadState, setLoadState] = useState<ApiAvailabilityState>('loading');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [retryTick, setRetryTick] = useState(0);
  const [categoryRetryTick, setCategoryRetryTick] = useState(0);
  const [warmupAttempts, setWarmupAttempts] = useState(0);
  const [filters, setFilters] = useState<FilterValues>({
    category: '',
    sortBy: 'createdAt',
    direction: 'DESC',
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isCancelled = false;
    let retryTimeout: number | undefined;

    const fetchProducts = async () => {
      setIsLoading(true);
      setLoadState((current) => (current === 'warming_up' ? current : 'loading'));

      try {
        const params = {
          page: currentPage,
          size: 12,
          sortBy: filters.sortBy,
          direction: filters.direction as 'ASC' | 'DESC',
        };

        const response = searchQuery
          ? await productService.searchProducts({ query: searchQuery, ...params })
          : filters.category
          ? await productService.getProductsByCategory(filters.category, params)
          : await productService.getAllProducts(params);

        if (isCancelled) {
          return;
        }

        setProducts(response.content || []);
        setTotalPages(response.totalPages || 0);
        setLoadState('ready');
        setWarmupAttempts(0);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        console.error('Error fetching products:', error);

        if (isBackendUnavailableError(error)) {
          setLoadState('warming_up');
          setWarmupAttempts((current) => current + 1);
          retryTimeout = window.setTimeout(() => {
            setRetryTick((current) => current + 1);
          }, BACKEND_RETRY_DELAY_MS);
          return;
        }

        setLoadState('error');
        setProducts([]);
        setTotalPages(0);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void fetchProducts();

    return () => {
      isCancelled = true;

      if (retryTimeout) {
        window.clearTimeout(retryTimeout);
      }
    };
  }, [currentPage, filters.category, filters.direction, filters.sortBy, retryTick, searchQuery]);

  useEffect(() => {
    let isCancelled = false;
    let retryTimeout: number | undefined;

    const fetchCategories = async () => {
      try {
        const nextCategories = await productService.getCategories();
        if (isCancelled) {
          return;
        }

        setCategories(nextCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);

        if (isBackendUnavailableError(error)) {
          retryTimeout = window.setTimeout(() => {
            setCategoryRetryTick((current) => current + 1);
          }, BACKEND_RETRY_DELAY_MS);
          return;
        }

        if (!isCancelled) {
          setCategories([]);
        }
      }
    };

    void fetchCategories();

    return () => {
      isCancelled = true;

      if (retryTimeout) {
        window.clearTimeout(retryTimeout);
      }
    };
  }, [categoryRetryTick]);

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setCurrentPage(0);
    setLoadState('loading');
    setWarmupAttempts(0);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(0);
    setLoadState('loading');
    setWarmupAttempts(0);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setLoadState('loading');
    setWarmupAttempts(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    setWarmupAttempts(0);
    setLoadState('loading');
    setRetryTick((current) => current + 1);
  };

  const isBackendWarmingUp = loadState === 'warming_up';
  const isGridBusy = isLoading || isBackendWarmingUp;
  const warmupTitle =
    warmupAttempts > 1 ? 'El catalogo ya casi esta disponible' : 'Estamos conectando con el catalogo';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Nuestros Productos</h1>
        <p className="mt-2 text-gray-600">
          Explora nuestra seleccion de productos de calidad
        </p>
      </div>

      <div className="mb-8">
        <ProductFilters
          categories={categories}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />
      </div>

      {isBackendWarmingUp ? (
        <BackendStatusNotice
          className="mb-6"
          title={warmupTitle}
          message="Si el backend estaba inactivo, puede tardar un poco en volver. Reintentamos automaticamente mientras esperas."
          onRetry={handleRetry}
        />
      ) : null}

      {loadState === 'error' ? (
        <BackendStatusNotice
          variant="error"
          className="mb-6"
          title="No pudimos actualizar el catalogo"
          message="Puedes reintentar ahora o volver en unos segundos. Cuando el backend responda, la lista cargara normal."
          onRetry={handleRetry}
        />
      ) : null}

      <ProductGrid
        products={products}
        isLoading={isGridBusy}
        emptyMessage={loadState === 'error' ? 'No pudimos cargar el catalogo' : undefined}
        emptyDescription={
          loadState === 'error'
            ? 'Prueba otra vez en unos segundos o usa el boton de reintentar.'
            : undefined
        }
        loadingMessage={
          isBackendWarmingUp ? 'Despertando productos y categorias...' : 'Cargando productos...'
        }
        loadingDescription={
          isBackendWarmingUp
            ? 'Mostraremos los productos apenas el backend quede listo, sin obligarte a refrescar.'
            : 'Esto suele tardar solo unos segundos.'
        }
      />

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            Anterior
          </Button>

          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={currentPage === i ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handlePageChange(i)}
            >
              {i + 1}
            </Button>
          )).slice(
            Math.max(0, currentPage - 2),
            Math.min(totalPages, currentPage + 3)
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}
