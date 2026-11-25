'use client';

import PasswordInput from '@/components/PasswordInput';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { SignUpSchema } from '@/lib/validationSchemas';
import { requestSignupCode, verifySignupCode } from '@/lib/signupActions';

type SignUpForm = Yup.InferType<typeof SignUpSchema>;

const SignUp = () => {
  const router = useRouter();
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({ resolver: yupResolver(SignUpSchema) });

  const onSubmit = async (data: SignUpForm) => {
    setError('');
    setMessage('');
    try {
      if (!verificationId) {
        const result = await requestSignupCode({ email: data.email });
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setVerificationId(result.verificationId);
        setVerificationEmail(result.email);
        setMessage(`A code was sent to ${result.email}. Check your inbox and spam folder.`);
        return;
      }

      const result = await verifySignupCode({
        verificationId,
        code,
        password: data.password,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }

      // The code is already consumed even if the following sign-in fails.
      setVerificationId(null);
      setCode('');
      setMessage('Email verified. Signing you in…');
      const login = await signIn('credentials', {
        email: result.email,
        password: data.password,
        redirect: false,
      });
      if (!login || login.error) {
        setError('Your email is verified. Please use the sign-in page to sign in.');
        return;
      }
      router.push('/list');
      router.refresh();
    } catch {
      setError('The request could not finish. Try again, or sign in if verification already succeeded.');
    }
  };

  const restart = () => {
    setVerificationId(null);
    setVerificationEmail('');
    setCode('');
    setError('');
    setMessage('Enter your details to request a new code. Wait at least 60 seconds between requests.');
  };

  return (
    <main>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={5}>
            <h1 className="text-center">Sign Up</h1>
            <Card>
              <Card.Body>
                <p>Use your @hawaii.edu email. Your account is created after you verify the code.</p>
                <p>Already registered but unverified? Use your existing password here to verify your email.</p>
                {error && <Alert variant="danger" role="alert">{error}</Alert>}
                {message && <Alert variant="info" role="status">{message}</Alert>}
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <fieldset disabled={isSubmitting}>
                    <Form.Group className="mb-3" controlId="signup-email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        autoComplete="email"
                        {...register('email')}
                        readOnly={Boolean(verificationId)}
                        isInvalid={Boolean(errors.email)}
                      />
                      <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="signup-password">
                      <Form.Label>Password</Form.Label>
                      <PasswordInput
                        id="signup-password"
                        label="Password"
                        autoComplete="new-password"
                        {...register('password')}
                        error={errors.password?.message}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="signup-confirm-password">
                      <Form.Label>Confirm Password</Form.Label>
                      <PasswordInput
                        id="signup-confirm-password"
                        label="Confirm password"
                        autoComplete="new-password"
                        {...register('confirmPassword')}
                        error={errors.confirmPassword?.message}
                      />
                    </Form.Group>
                    {verificationId && (
                      <Form.Group className="mb-3" controlId="signup-code">
                        <Form.Label>Verification code for {verificationEmail}</Form.Label>
                        <Form.Control
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          pattern="[0-9]{6}"
                          minLength={6}
                          maxLength={6}
                          value={code}
                          onChange={(event) => setCode(event.target.value)}
                          required
                        />
                        <Form.Text>Expires in 10 minutes. Only the newest code works.</Form.Text>
                      </Form.Group>
                    )}
                    <div className="d-flex flex-wrap gap-2">
                      <Button id="auth-verify" variant="secondary" type="submit">
                        {isSubmitting ? 'Please wait…' : verificationId ? 'Verify and continue' : 'Send verification code'}
                      </Button>
                      {verificationId && (
                        <Button id="auth-verify" type="button" variant="outline-primary" onClick={restart}>
                          Request a new code / change email
                        </Button>
                      )}
                      <Button id="auth-reset" type="button" variant="outline-danger" onClick={() => { restart(); reset(); }}>
                        Reset
                      </Button>
                    </div>
                  </fieldset> 
                </Form>
              </Card.Body>
              <Card.Footer>Already verified? <a href="/auth/signin">Sign in</a></Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default SignUp;
