'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { useCartStore } from '@/stores/cart-store';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils/cn';
import { useState } from 'react';

export function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCartStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Productos', href: '/products' },
    { name: 'Carrito', href: '/cart' },
  ];

  const adminNavigation = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Productos', href: '/admin/products' },
    { name: 'Pedidos', href: '/admin/orders' },
  ];

  const isAdmin = user?.role === 'ADMIN';

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-indigo-600">
                Novedades LZ
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'text-indigo-600'
                    : 'text-gray-700 hover:text-indigo-600'
                )}
              >
                {item.name === 'Carrito' ? (
                  <span className="relative">
                    {item.name}
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-4 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </span>
                ) : (
                  item.name
                )}
              </Link>
            ))}

            {isAdmin &&
              adminNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors',
                    pathname.startsWith(item.href)
                      ? 'text-indigo-600'
                      : 'text-gray-700 hover:text-indigo-600'
                  )}
                >
                  {item.name}
                </Link>
              ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-700">
                  Hola, {user?.fullName?.split(' ')[0]}
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Registrarse</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-indigo-600"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'text-indigo-600'
                      : 'text-gray-700'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name === 'Carrito' && totalItems > 0
                    ? `${item.name} (${totalItems})`
                    : item.name}
                </Link>
              ))}

              {isAdmin &&
                adminNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'text-sm font-medium transition-colors',
                      pathname.startsWith(item.href)
                        ? 'text-indigo-600'
                        : 'text-gray-700'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

              <div className="pt-4 border-t border-gray-100">
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm text-gray-700">
                      Hola, {user?.fullName?.split(' ')[0]}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Cerrar Sesión
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full">
                        Iniciar Sesión
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button size="sm" className="w-full">
                        Registrarse
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
