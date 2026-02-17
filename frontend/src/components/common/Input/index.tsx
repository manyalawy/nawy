'use client';

import React from 'react';
import { InputWrapper, Label, StyledInput, ErrorMessage } from './styles';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, ...props }: InputProps) {
  return (
    <InputWrapper>
      {label && <Label htmlFor={id}>{label}</Label>}
      <StyledInput id={id} $hasError={!!error} {...props} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputWrapper>
  );
}
