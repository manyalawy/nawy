'use client';

import React from 'react';
import { SelectWrapper, Label, StyledSelect, ErrorMessage } from './styles';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

export function Select({ label, error, id, children, ...props }: SelectProps) {
  return (
    <SelectWrapper>
      {label && <Label htmlFor={id}>{label}</Label>}
      <StyledSelect id={id} $hasError={!!error} {...props}>
        {children}
      </StyledSelect>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </SelectWrapper>
  );
}
