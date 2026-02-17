'use client';

import styled from 'styled-components';

export const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

export const FormTitle = styled.h1`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const FormFooter = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  }
`;

export const ErrorAlert = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;
