'use client';

import styled from 'styled-components';
import { Container } from '../Container';

const FooterWrapper = styled.footer`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => `${theme.spacing.xl} 0`};
  margin-top: auto;
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  text-align: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const Copyright = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin: 0;
`;

const Links = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FooterLink = styled.a`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <FooterWrapper>
      <Container>
        <FooterContent>
          <Copyright>
            &copy; {currentYear} Nawy. All rights reserved.
          </Copyright>
          <Links>
            <FooterLink href="#">Privacy Policy</FooterLink>
            <FooterLink href="#">Terms of Service</FooterLink>
            <FooterLink href="#">Contact</FooterLink>
          </Links>
        </FooterContent>
      </Container>
    </FooterWrapper>
  );
}
