'use client';

import styled from 'styled-components';

interface StyledCardProps {
  $hoverable?: boolean;
}

export const StyledCard = styled.div<StyledCardProps>`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  ${({ $hoverable }) =>
    $hoverable &&
    `
    cursor: pointer;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }
  `}
`;

export const CardHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const CardBody = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`;

export const CardFooter = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.backgroundAlt};
`;
