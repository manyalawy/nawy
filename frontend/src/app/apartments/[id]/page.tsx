'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import styled from 'styled-components';
import { Container } from '@/components/layout/Container';
import { ApartmentDetails } from '@/components/apartments/ApartmentDetails';
import { Spinner } from '@/components/common/Spinner';
import { Button } from '@/components/common/Button';
import { Apartment } from '@/types/apartment';
import { api } from '@/lib/api';

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

export default function ApartmentDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadApartment = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.getApartment(id);
        setApartment(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load apartment');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadApartment();
    }
  }, [id]);

  return (
    <Container>
      {loading ? (
        <LoadingContainer>
          <Spinner size="lg" />
        </LoadingContainer>
      ) : error ? (
        <ErrorContainer>
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} style={{ marginTop: '16px' }}>
            Try Again
          </Button>
        </ErrorContainer>
      ) : apartment ? (
        <ApartmentDetails apartment={apartment} />
      ) : null}
    </Container>
  );
}
