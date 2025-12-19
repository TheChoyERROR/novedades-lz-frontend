'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth';
import { Card, CardContent, CardHeader, Spinner } from '@/components/ui';
import { productService } from '@/services/product.service';
import { orderService } from '@/services/order.service';
import { formatPrice } from '@/lib/utils/format';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
}

function AdminDashboardContent() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          productService.getAllProducts({ page: 0, size: 1 }),
          orderService.getAllOrders({ page: 0, size: 100 }),
        ]);

        const pendingOrders = ordersRes.content.filter(
          (order) => order.status === 'PENDING'
        ).length;

        const totalRevenue = ordersRes.content
          .filter((order) => order.status !== 'CANCELLED')
          .reduce((sum, order) => sum + order.totalAmount, 0);

        setStats({
          totalProducts: productsRes.totalElements,
          totalOrders: ordersRes.totalElements,
          pendingOrders,
          totalRevenue,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Panel de Administración
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Productos</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalProducts || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Pedidos</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Pedidos Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.pendingOrders || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Ingresos Totales</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(stats?.totalRevenue || 0, 'PEN')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Gestión de Productos</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Administra tu catálogo de productos, agrega nuevos productos o actualiza el stock.
            </p>
            <Link href="/admin/products" className="inline-block">
              <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                Ir a Productos →
              </button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Gestión de Pedidos</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Revisa los pedidos pendientes, actualiza estados y gestiona las entregas.
            </p>
            <Link href="/admin/orders" className="inline-block">
              <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                Ir a Pedidos →
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
