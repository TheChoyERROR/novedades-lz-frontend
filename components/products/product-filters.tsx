'use client';

import { useState } from 'react';
import { Input, Select, Button } from '@/components/ui';

interface ProductFiltersProps {
  categories: string[];
  onFilterChange: (filters: FilterValues) => void;
  onSearch: (query: string) => void;
}

interface FilterValues {
  category: string;
  sortBy: string;
  direction: string;
}

const sortOptions = [
  { value: 'createdAt', label: 'Más recientes' },
  { value: 'name', label: 'Nombre' },
  { value: 'price', label: 'Precio' },
];

const directionOptions = [
  { value: 'DESC', label: 'Descendente' },
  { value: 'ASC', label: 'Ascendente' },
];

export function ProductFilters({ categories, onFilterChange, onSearch }: ProductFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterValues>({
    category: '',
    sortBy: 'createdAt',
    direction: 'DESC',
  });

  const categoryOptions = [
    { value: '', label: 'Todas las categorías' },
    ...categories.map((cat) => ({ value: cat, label: cat })),
  ];

  const handleFilterChange = (key: keyof FilterValues, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    const defaultFilters = { category: '', sortBy: 'createdAt', direction: 'DESC' };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
    onSearch('');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <Input
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" variant="primary">
          Buscar
        </Button>
      </form>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select
          label="Categoría"
          options={categoryOptions}
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        />

        <Select
          label="Ordenar por"
          options={sortOptions}
          value={filters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
        />

        <Select
          label="Dirección"
          options={directionOptions}
          value={filters.direction}
          onChange={(e) => handleFilterChange('direction', e.target.value)}
        />
      </div>

      {/* Clear Filters */}
      <div className="mt-4 flex justify-end">
        <Button variant="ghost" size="sm" onClick={handleClearFilters}>
          Limpiar Filtros
        </Button>
      </div>
    </div>
  );
}
