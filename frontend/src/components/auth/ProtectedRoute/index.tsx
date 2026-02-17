'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/common/Spinner';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
`;

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'USER' | 'ADMIN';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }

    if (!isLoading && isAuthenticated && requiredRole && user?.role !== requiredRole) {
      router.push('/apartments');
    }
  }, [isLoading, isAuthenticated, requiredRole, user, router]);

  if (isLoading) {
    return (
      <LoadingContainer>
        <Spinner size="lg" />
      </LoadingContainer>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
