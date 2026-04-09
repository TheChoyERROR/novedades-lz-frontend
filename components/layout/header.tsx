'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Button } from '@/components/ui';
import { useAuth } from '@/lib/hooks/use-auth';
import { cn } from '@/lib/utils/cn';
import { useCartStore } from '@/stores/cart-store';

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
    <header className="sticky top-0 z-30 border-b border-border bg-[var(--header-background)] backdrop-blur-xl shadow-[0_16px_40px_rgba(89,11,49,0.08)]">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex flex-shrink-0 items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary-200/50 blur-md" />
                <Image
                  src="/brand/logo.png"
                  alt="Logo de Novedades LZ"
                  width={52}
                  height={52}
                  className="relative h-[52px] w-[52px] object-contain"
                  priority
                />
              </div>
              <div className="hidden sm:flex flex-col leading-none">
                <span className="text-lg font-bold text-primary-700 dark:text-primary-800">
                  Novedades LZ
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary-500">
                  De todo para todos
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'text-primary-600'
                    : 'text-muted-foreground hover:text-primary-600'
                )}
              >
                {item.name === 'Carrito' ? (
                  <span className="relative">
                    {item.name}
                    {totalItems > 0 && (
                      <span className="absolute -right-4 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs text-white">
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
                      ? 'text-primary-600'
                      : 'text-muted-foreground hover:text-primary-600'
                  )}
                >
                  {item.name}
                </Link>
              ))}
          </div>

          <div className="hidden md:flex md:items-center md:space-x-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Hola, {user?.fullName?.split(' ')[0]}
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Cerrar sesion
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Iniciar sesion
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Registrarse</Button>
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-sm transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600"
              aria-label={isMobileMenuOpen ? 'Cerrar menu' : 'Abrir menu'}
            >
              <svg
                className="h-5 w-5"
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

        {isMobileMenuOpen && (
          <div className="border-t border-border py-4 md:hidden">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors',
                    pathname === item.href ? 'text-primary-600' : 'text-muted-foreground'
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
                        ? 'text-primary-600'
                        : 'text-muted-foreground'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

              <div className="border-t border-border pt-4">
                <div className="mb-3">
                  <ThemeToggle showLabel className="w-full justify-between" />
                </div>
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm text-muted-foreground">
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
                      Cerrar sesion
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full">
                        Iniciar sesion
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
