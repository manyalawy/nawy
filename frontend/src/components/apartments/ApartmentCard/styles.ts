'use client';

import styled from 'styled-components';

export const CardWrapper = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  cursor: pointer;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-4px);
  }
`;

export const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const StatusBadge = styled.span<{ $status: string }>`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ $status }) => {
    switch ($status) {
      case 'AVAILABLE':
        return 'rgba(34, 197, 94, 0.9)';
      case 'RESERVED':
        return 'rgba(245, 158, 11, 0.9)';
      case 'SOLD':
        return 'rgba(239, 68, 68, 0.9)';
      default:
        return 'rgba(100, 116, 139, 0.9)';
    }
  }};
  color: white;
`;

export const CardContent = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`;

export const ProjectName = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const UnitName = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const Price = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const SpecsRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

export const Spec = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;
