'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { LoadingScreen } from '@/components/ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'USER';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }

    if (!isLoading && isAuthenticated && requiredRole && user?.role !== requiredRole) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, requiredRole, user, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <LoadingScreen />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
