'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { ApartmentGrid } from '@/components/apartments/ApartmentGrid';
import { SearchFilters } from '@/components/apartments/SearchFilters';
import { CreateApartmentModal } from '@/components/apartments/CreateApartmentModal';
import { CreateProjectModal } from '@/components/apartments/CreateProjectModal';
import { Spinner } from '@/components/common/Spinner';
import { Button } from '@/components/common/Button';
import { Apartment, FilterParams } from '@/types/apartment';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Main = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl};
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.error};
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const PageInfo = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const AdminActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export default function ApartmentsPage() {
  const { user } = useAuth();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterParams>({ page: 1, limit: 12 });
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isCreateApartmentModalOpen, setIsCreateApartmentModalOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);

  const loadApartments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getApartments(filters);
      setApartments(response.data);
      setTotalPages(response.meta.totalPages);
      setTotal(response.meta.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load apartments');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadApartments();
  }, [loadApartments]);

  const handleFiltersChange = (newFilters: FilterParams) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PageWrapper>
      <Header />
      <Main>
        <Container>
          <PageHeader>
            <Title>Find Your Perfect Apartment</Title>
            <Subtitle>
              {total > 0 ? `${total} apartments available` : 'Browse our collection'}
            </Subtitle>
          </PageHeader>

          {user?.role === 'ADMIN' && (
            <AdminActions>
              <Button onClick={() => setIsCreateApartmentModalOpen(true)}>
                Add Apartment
              </Button>
              <Button variant="secondary" onClick={() => setIsCreateProjectModalOpen(true)}>
                Add Project
              </Button>
            </AdminActions>
          )}

          <SearchFilters filters={filters} onFiltersChange={handleFiltersChange} />

          {loading ? (
            <LoadingContainer>
              <Spinner size="lg" />
            </LoadingContainer>
          ) : error ? (
            <ErrorContainer>
              <p>{error}</p>
              <Button onClick={loadApartments} style={{ marginTop: '16px' }}>
                Try Again
              </Button>
            </ErrorContainer>
          ) : (
            <>
              <ApartmentGrid apartments={apartments} />

              {totalPages > 1 && (
                <PaginationWrapper>
                  <Button
                    variant="secondary"
                    disabled={filters.page === 1}
                    onClick={() => handlePageChange((filters.page || 1) - 1)}
                  >
                    Previous
                  </Button>
                  <PageInfo>
                    Page {filters.page} of {totalPages}
                  </PageInfo>
                  <Button
                    variant="secondary"
                    disabled={filters.page === totalPages}
                    onClick={() => handlePageChange((filters.page || 1) + 1)}
                  >
                    Next
                  </Button>
                </PaginationWrapper>
              )}
            </>
          )}
        </Container>
      </Main>
      <Footer />

      <CreateApartmentModal
        isOpen={isCreateApartmentModalOpen}
        onClose={() => setIsCreateApartmentModalOpen(false)}
        onSuccess={loadApartments}
      />

      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
        onSuccess={() => {}}
      />
    </PageWrapper>
  );
}
