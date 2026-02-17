'use client';

import styled from 'styled-components';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RegisterForm } from '@/components/auth/RegisterForm';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

export default function RegisterPage() {
  return (
    <PageWrapper>
      <Header />
      <Main>
        <RegisterForm />
      </Main>
      <Footer />
    </PageWrapper>
  );
}
