'use client';

import React from 'react';
import { StyledCard, CardHeader, CardBody, CardFooter } from './styles';

interface CardProps {
  children: React.ReactNode;
  hoverable?: boolean;
  onClick?: () => void;
}

export function Card({ children, hoverable = false, onClick }: CardProps) {
  return (
    <StyledCard $hoverable={hoverable} onClick={onClick}>
      {children}
    </StyledCard>
  );
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
