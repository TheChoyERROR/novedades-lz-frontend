'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth';
import { Button, Card, CardContent, CardHeader, Spinner } from '@/components/ui';
import { SiteSettings } from '@/components/admin/site-settings';
import { adminService } from '@/services/admin.service';
import { formatPrice } from '@/lib/utils/format';
import { DashboardStats } from '@/types';

function AdminDashboardContent() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Una sola llamada: el backend calcula los agregados con SUM y COUNT sobre toda la tabla.
        setStats(await adminService.getDashboardStats());
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchStats();
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
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administracion</h1>

        {/* El PDF se arma con los precios en vivo, asi que nunca queda desactualizado. */}
        <a href="/catalogo/pdf" className="sm:shrink-0">
          <Button variant="outline" className="w-full gap-2 sm:w-auto">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            Descargar catalogo PDF
          </Button>
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-lg">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Productos</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalProducts ?? 0}</p>
                {stats && stats.lowStockProducts > 0 ? (
                  <p className="mt-0.5 text-xs font-medium text-amber-600">
                    {stats.lowStockProducts} con stock bajo
                  </p>
                ) : null}
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
                <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders ?? 0}</p>
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
                <p className="text-sm text-gray-500">Comprobantes por revisar</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.ordersAwaitingReview ?? 0}</p>
                {stats && stats.pendingOrders > 0 ? (
                  <p className="mt-0.5 text-xs text-gray-500">
                    {stats.pendingOrders} sin comprobante aun
                  </p>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-lg">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Ingresos Totales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(stats?.totalRevenue ?? 0, 'PEN')}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {formatPrice(stats?.revenueThisMonth ?? 0, 'PEN')} este mes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <SiteSettings />
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Gestion de Productos</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Administra tu catalogo de productos, agrega nuevos productos o actualiza el stock.
            </p>
            <Link
              href="/admin/products"
              className="inline-block font-medium text-primary-600 hover:text-primary-700"
            >
              Ir a Productos -&gt;
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Gestion de Pedidos</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Revisa los pedidos pendientes, actualiza estados y gestiona las entregas.
            </p>
            <Link
              href="/admin/orders"
              className="inline-block font-medium text-primary-600 hover:text-primary-700"
            >
              Ir a Pedidos -&gt;
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
