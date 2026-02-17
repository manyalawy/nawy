'use client';

import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const sizes = {
  sm: '16px',
  md: '24px',
  lg: '32px',
};

interface SpinnerContainerProps {
  $size: 'sm' | 'md' | 'lg';
}

const SpinnerContainer = styled.div<SpinnerContainerProps>`
  width: ${({ $size }) => sizes[$size]};
  height: ${({ $size }) => sizes[$size]};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export function Spinner({ size = 'md' }: SpinnerProps) {
  return <SpinnerContainer $size={size} />;
}
