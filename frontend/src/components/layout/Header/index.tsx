'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Container } from '../Container';
import { Button } from '@/components/common/Button';
import {
  HeaderWrapper,
  HeaderContent,
  Logo,
  Nav,
  NavLink,
  UserInfo,
  UserName,
} from './styles';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <HeaderWrapper>
      <Container>
        <HeaderContent>
          <Link href="/" passHref legacyBehavior>
            <Logo>Nawy</Logo>
          </Link>

          <Nav>
            <Link href="/apartments" passHref legacyBehavior>
              <NavLink>Apartments</NavLink>
            </Link>

            {isAuthenticated ? (
              <UserInfo>
                <UserName>{user?.name}</UserName>
                <Button variant="secondary" size="sm" onClick={logout}>
                  Logout
                </Button>
              </UserInfo>
            ) : (
              <>
                <Link href="/login" passHref legacyBehavior>
                  <NavLink>Login</NavLink>
                </Link>
                <Link href="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </Nav>
        </HeaderContent>
      </Container>
    </HeaderWrapper>
  );
}
