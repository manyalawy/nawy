'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { FormContainer, FormTitle, Form, FormFooter, ErrorAlert } from './styles';

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      router.push('/apartments');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <Card>
        <Card.Body>
          <FormTitle>Welcome Back</FormTitle>

          {error && <ErrorAlert>{error}</ErrorAlert>}

          <Form onSubmit={handleSubmit}>
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" fullWidth loading={loading}>
              Sign In
            </Button>
          </Form>

          <FormFooter>
            Don&apos;t have an account?{' '}
            <Link href="/register">Register here</Link>
          </FormFooter>
        </Card.Body>
      </Card>
    </FormContainer>
  );
}
