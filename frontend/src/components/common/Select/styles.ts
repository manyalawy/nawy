'use client';

import styled from 'styled-components';

export const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text};
`;

interface StyledSelectProps {
  $hasError?: boolean;
}

export const StyledSelect = styled.select<StyledSelectProps>`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme, $hasError }) => ($hasError ? theme.colors.error : theme.colors.border)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) => ($hasError ? theme.colors.error : theme.colors.primary)};
    box-shadow: 0 0 0 3px ${({ theme, $hasError }) =>
      $hasError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(37, 99, 235, 0.2)'};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.backgroundAlt};
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.error};
`;
