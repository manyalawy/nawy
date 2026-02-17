'use client';

import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 0 ${({ theme }) => theme.spacing.xl};
  }
`;
