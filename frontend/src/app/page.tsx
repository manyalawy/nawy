'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Spinner } from '@/components/common/Spinner';

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/apartments');
  }, [router]);

  return (
    <LoadingContainer>
      <Spinner size="lg" />
    </LoadingContainer>
  );
}
