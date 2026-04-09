'use client';

import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { Header } from './header';
import { Footer } from './footer';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--surface-elevated)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
            boxShadow: '0 16px 36px rgba(89, 11, 49, 0.16)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
