'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';

const SignIn = () => {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    const email = String(data.get('email') ?? '').trim().toLowerCase();
    const password = String(data.get('password') ?? '');
    setBusy(true);
    setError('');
    try {
      const result = await signIn('credentials', { email, password, redirect: false });
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
  };

  return (
    <main>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={5}>
            <h1 className="text-center">Sign In</h1>
            <Card>
              <Card.Body>
                {error && <Alert variant="danger" role="alert">{error}</Alert>}
                <Form method="post" onSubmit={handleSubmit}>
                  <fieldset disabled={busy}>
                    <Form.Group className="mb-3" controlId="signin-email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@hawaii.edu"
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="signin-password">
                      <Form.Label>Password</Form.Label>
                      <Form.Control name="password" type="password" autoComplete="current-password" required />
                    </Form.Group>
                    <Button type="submit">{busy ? 'Signing in…' : 'Sign in'}</Button>
                  </fieldset>
                </Form>
              </Card.Body>
              <Card.Footer>
                <div>Don&apos;t have an account? <a href="/auth/signup">Sign up</a></div>
                <div>Already registered but unverified? <a href="/auth/signup">Verify your email</a></div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default SignIn;
