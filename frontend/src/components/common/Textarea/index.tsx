'use client';

import React from 'react';
import { TextareaWrapper, Label, StyledTextarea, ErrorMessage } from './styles';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, id, ...props }: TextareaProps) {
  return (
    <TextareaWrapper>
      {label && <Label htmlFor={id}>{label}</Label>}
      <StyledTextarea id={id} $hasError={!!error} {...props} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </TextareaWrapper>
  );
}
