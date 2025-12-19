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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
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
