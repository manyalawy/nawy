'use client';

import styled from 'styled-components';
import { Apartment } from '@/types/apartment';
import { ApartmentCard } from '../ApartmentCard';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.textMuted};
`;

interface ApartmentGridProps {
  apartments: Apartment[];
}

export function ApartmentGrid({ apartments }: ApartmentGridProps) {
  if (apartments.length === 0) {
    return (
      <Grid>
        <EmptyState>
          <h3>No apartments found</h3>
          <p>Try adjusting your search filters</p>
        </EmptyState>
      </Grid>
    );
  }

  return (
    <Grid>
      {apartments.map((apartment) => (
        <ApartmentCard key={apartment.id} apartment={apartment} />
      ))}
    </Grid>
  );
}
