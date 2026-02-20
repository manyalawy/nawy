'use client';

import styled from 'styled-components';
import { LoginForm } from '@/components/auth/LoginForm';

const CenteredContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
`;

export default function LoginPage() {
  return (
    <CenteredContent>
      <LoginForm />
    </CenteredContent>
  );
}
