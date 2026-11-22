'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { requestPasswordReset } from '@/lib/passwordResetActions';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const normalized = email.trim().toLowerCase();
    if (!/^[^\s@]+@hawaii\.edu$/.test(normalized)) {
      setError('Enter your @hawaii.edu email address.');
      return;
    }
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const result = await requestPasswordReset({ email: normalized });
      setMessage(result.message);
    } catch {
      setError('The request could not finish. Please try again shortly.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main><Container className="py-4"><Row className="justify-content-center"><Col xs={12} md={8} lg={5}>
      <h1 className="text-center">Forgot password?</h1>
      <Card><Card.Body>
        <p>Enter your account email to request a password reset link.</p>
        {message && <Alert variant="info" role="status">{message}</Alert>}
        {error && <Alert variant="danger" role="alert">{error}</Alert>}
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3" controlId="reset-email">
            <Form.Label>UH email</Form.Label>
            <Form.Control type="email" autoComplete="email" maxLength={254} value={email} onChange={event => setEmail(event.target.value)} disabled={busy} required />
          </Form.Group>
          <Button type="submit" disabled={busy}>{busy ? 'Requesting…' : 'Send reset link'}</Button>
        </Form>
        <p className="mt-3 mb-0">Wait at least 60 seconds between requests. Links expire in 30 minutes.</p>
      </Card.Body><Card.Footer><Link href="/auth/signin">Back to sign in</Link></Card.Footer></Card>
    </Col></Row></Container></main>
  );
}
