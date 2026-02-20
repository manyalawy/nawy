'use client';

import styled from 'styled-components';
import { RegisterForm } from '@/components/auth/RegisterForm';

const CenteredContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
`;

export default function RegisterPage() {
  return (
    <CenteredContent>
      <RegisterForm />
    </CenteredContent>
  );
}
