'use client';

import styled from 'styled-components';

export const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
`;

export const Logo = styled.a`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const NavLink = styled.a`
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: background-color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.backgroundAlt};
    text-decoration: none;
  }
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const UserName = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none;
  }
`;
