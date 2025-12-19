'use client';

import { useEffect, useState, useCallback } from 'react';
import { Product } from '@/types';
import { productService } from '@/services/product.service';
import { ProductGrid, ProductFilters } from '@/components/products';
import { Button } from '@/components/ui';

interface FilterValues {
  category: string;
  sortBy: string;
  direction: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<FilterValues>({
    category: '',
    sortBy: 'createdAt',
    direction: 'DESC',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, unknown> = {
        page: currentPage,
        size: 12,
        sort: `${filters.sortBy},${filters.direction}`,
      };

      let response;

      if (searchQuery) {
        response = await productService.searchProducts({ query: searchQuery, ...params });
      } else if (filters.category) {
        response = await productService.getProductsByCategory(filters.category, params);
      } else {
        response = await productService.getAllProducts(params);
      }

      const content = response?.content || [];
      setProducts(content);
      setTotalPages(response?.totalPages || 0);

      // Extract unique categories from all products for filter
      if (!filters.category && !searchQuery && content.length > 0) {
        const uniqueCategories = [...new Set(content.map((p: Product) => p.category))];
        setCategories((prev) => {
          const allCats = [...new Set([...prev, ...uniqueCategories])];
          return allCats.sort();
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setCurrentPage(0);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(0);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Nuestros Productos</h1>
        <p className="mt-2 text-gray-600">
          Explora nuestra selección de productos de calidad
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <ProductFilters
          categories={categories}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />
      </div>

      {/* Products Grid */}
      <ProductGrid products={products} isLoading={isLoading} />

      {/* Pagination */}
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
