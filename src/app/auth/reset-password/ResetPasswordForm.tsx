'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { resetPassword } from '@/lib/passwordResetActions';
import PasswordInput from '@/components/PasswordInput';

export default function ResetPasswordForm() {
  const [token, setToken] = useState('');
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [complete, setComplete] = useState(false);
  const [verified, setVerified] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const value = new URLSearchParams(window.location.hash.slice(1)).get('token') ?? '';
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: window.location.hash only exists post-mount (SSR-safe); token must not be consumed on load (mail scanners)
    setToken(value);
    setReady(true);
    // Do not consume the token on load; mail scanners must not reset passwords.
    // The token stays in React state until submission, not in the visible address.
  }, []);


  useEffect(() => {
    // Run after the reading effect/Strict Mode replay, preserving the in-memory token.
    if (ready && token) {
      window.history.replaceState(window.history.state, '', window.location.pathname);
    }
  }, [ready, token]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const result = await resetPassword({ token, password, confirmPassword });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setComplete(true);
      setVerified(result.emailVerified);
      setToken('');
      setPassword('');
      setConfirmPassword('');
    } catch {
      setError('The request could not finish. Try signing in with your new password before requesting another link.');
    } finally {
      setBusy(false);
    }
  }

  const validToken = /^[a-f0-9]{64}$/.test(token);
  return (
    <main><Container className="py-4"><Row className="justify-content-center"><Col xs={12} md={8} lg={5}>
      <h1 className="text-center">Reset password</h1>
      <Card><Card.Body>
        {!ready ? <p>Loading reset form…</p> : complete ? (
          <Alert variant="success" role="status">
            Your password has been changed. Existing sessions will no longer authenticate.
            {!verified && <p className="mt-2 mb-0">Your email still needs verification. Use the signup verification page with your new password.</p>}
          </Alert>
        ) : !validToken ? (
          <Alert variant="warning">Open the complete link from your reset email. If you refreshed this page, reopen the email link.</Alert>
        ) : (
          <>
            {error && <Alert variant="danger" role="alert">{error}</Alert>}
            <Form onSubmit={onSubmit}>
              <fieldset disabled={busy}>
                <Form.Group className="mb-3" controlId="new-password">
                  <Form.Label>New password</Form.Label>
                  <PasswordInput
                    id="new-password"
                    label="New password"
                    autoComplete="new-password"
                    minLength={6}
                    maxLength={40}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={busy}
                    required
                  />
                  <Form.Text>
                    Use 6–40 characters. Passwords are case-sensitive.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="confirm-new-password">
                  <Form.Label>Confirm new password</Form.Label>
                  <PasswordInput
                    id="confirm-new-password"
                    label="Confirm new password"
                    autoComplete="new-password"
                    minLength={6}
                    maxLength={40}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    disabled={busy}
                    required
                  />
                </Form.Group>
                
                <Button type="submit">{busy ? 'Saving…' : 'Set new password'}</Button>
              </fieldset>
            </Form>
          </>
        )}
      </Card.Body><Card.Footer>
        <div><Link href="/auth/signin">Back to sign in</Link></div>
        {complete && !verified && <div><Link href="/auth/signup">Verify your email</Link></div>}
        {!complete && <div><Link href="/auth/forgot-password">Request a new reset link</Link></div>}
      </Card.Footer></Card>
    </Col></Row></Container></main>
  );
}
