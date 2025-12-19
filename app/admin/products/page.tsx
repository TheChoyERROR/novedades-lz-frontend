'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth';
import { Product, ProductCreateRequest } from '@/types';
import { productService } from '@/services/product.service';
import { Button, Card, CardContent, Input, Modal, Spinner, Badge } from '@/components/ui';
import { formatPrice } from '@/lib/utils/format';
import toast from 'react-hot-toast';

function AdminProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProductCreateRequest>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    imageUrl: '',
  });

  const fetchProducts = async () => {
    try {
      const response = await productService.getAllProducts({ page: 0, size: 100 });
      setProducts(response.content);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error al cargar productos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      imageUrl: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      imageUrl: product.imageUrl || '',
    });
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, formData);
        toast.success('Producto actualizado');
      } else {
        await productService.createProduct(formData);
        toast.success('Producto creado');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Error al guardar producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId: number) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      await productService.deleteProduct(productId);
      toast.success('Producto eliminado');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error al eliminar producto');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
        <Button onClick={openCreateModal}>+ Nuevo Producto</Button>
      </div>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-lg" />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="info">{product.category}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(product.price, 'PEN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'danger'}>
                        {product.stock} unidades
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(product)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(product.id)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Precio"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />
            <Input
              label="Stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>
          <Input
            label="Categoría"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
          <Input
            label="URL de Imagen"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingProduct ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminProductsContent />
    </ProtectedRoute>
  );
}
