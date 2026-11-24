'use client';

import PasswordInput from '@/components/PasswordInput';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';

export default function SignIn() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError('');
    try {
      const result = await signIn('credentials', {
        email: String(data.get('email') ?? '').trim().toLowerCase(),
        password: String(data.get('password') ?? ''),
        redirect: false,
      });
      if (!result || result.error) {
        setError('Sign-in failed. Check your email and password, and verify your email before signing in.');
        return;
      }
      router.push('/list');
      router.refresh();
    } catch {
      setError('Could not sign in. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main><Container className="py-4"><Row className="justify-content-center"><Col xs={12} md={8} lg={5}>
      <h1 className="text-center">Sign In</h1>
      <Card><Card.Body>
        {error && <Alert variant="danger" role="alert">{error}</Alert>}
        <Form method="post" onSubmit={handleSubmit}>
          <fieldset disabled={busy}>
            <Form.Group className="mb-3" controlId="signin-email">
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" type="email" autoComplete="email" placeholder="you@hawaii.edu" required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="signin-password">
              <Form.Label>Password</Form.Label>
              <PasswordInput id="signin-password" label="Password" name="password" autoComplete="current-password" required />
            </Form.Group>
            <Button type="submit">{busy ? 'Signing in…' : 'Sign in'}</Button>
          </fieldset>
        </Form>
        <p className="mt-3 mb-0"><Link href="/auth/forgot-password">Forgot password?</Link></p>
      </Card.Body><Card.Footer>
        <div>Need an account? <Link href="/auth/signup">Sign up</Link></div>
        <div>Already registered but unverified? <Link href="/auth/signup">Verify your email</Link></div>
      </Card.Footer></Card>
    </Col></Row></Container></main>
  );
}
