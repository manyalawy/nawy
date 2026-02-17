'use client';

import styled from 'styled-components';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  $variant?: BadgeVariant;
}

const variantColors: Record<BadgeVariant, { bg: string; text: string }> = {
  success: { bg: 'rgba(34, 197, 94, 0.1)', text: '#16a34a' },
  warning: { bg: 'rgba(245, 158, 11, 0.1)', text: '#d97706' },
  error: { bg: 'rgba(239, 68, 68, 0.1)', text: '#dc2626' },
  info: { bg: 'rgba(37, 99, 235, 0.1)', text: '#2563eb' },
};

export const Badge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ $variant = 'info' }) => variantColors[$variant].bg};
  color: ${({ $variant = 'info' }) => variantColors[$variant].text};
`;
