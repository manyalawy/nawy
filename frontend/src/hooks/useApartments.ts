'use client';

import { useState, useEffect, useCallback } from 'react';
import { Apartment, FilterParams, PaginatedResponse } from '@/types/apartment';
import { api } from '@/lib/api';

interface UseApartmentsResult {
  apartments: Apartment[];
  loading: boolean;
  error: string | null;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
  refetch: () => void;
}

export function useApartments(filters: FilterParams = {}): UseApartmentsResult {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<PaginatedResponse<Apartment>['meta'] | null>(null);

  const fetchApartments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getApartments(filters);
      setApartments(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load apartments');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchApartments();
  }, [fetchApartments]);

  return {
    apartments,
    loading,
    error,
    meta,
    refetch: fetchApartments,
  };
}
