'use client';

import PasswordInput from '@/components/PasswordInput';

import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react'; // v5 compatible
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import swal from 'sweetalert';
import { Card, Col, Container, Button, Form, Row } from 'react-bootstrap';
import { changePassword } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';

type ChangePasswordForm = {
  oldpassword: string;
  password: string;
  confirmPassword: string;
  // acceptTerms: boolean;
};

/** The change password page. */
const ChangePassword = () => {
  const { data: session, status } = useSession();
  const email = session?.user?.email || '';
  const validationSchema = Yup.object().shape({
    oldpassword: Yup.string().required('Password is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters'),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password'), ''], 'Confirm Password does not match'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: ChangePasswordForm) => {
    if (!email) {
      await swal('Sign in required', 'Please sign in first.', 'error');
      return;
    }
    try {
      await changePassword({
        email,
        currentPassword: data.oldpassword,
        password: data.password,
      });
      await swal({
        title: 'Password Changed',
        text: 'Your password has been changed.',
        icon: 'success',
        timer: 2000,
      });
      reset();
    } catch (error) {
      await swal(
        'Password change failed',
        error instanceof Error ? error.message : 'Could not change your password. Please try again.',
        'error',
      );
    }
  };

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Container>
        <Row className="justify-content-center">
          <Col xs={5}>
            <h1 className="text-center">Change Password</h1>
            <Card>
              <Card.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className="form-group">
                    <Form.Label>Old Password</Form.Label>
                    <PasswordInput
                      label="Current password"
                      autoComplete="current-password"
                      {...register('oldpassword')}
                      error={errors.oldpassword?.message}
                    />
                  </Form.Group>

                  <Form.Group className="form-group">
                    <Form.Label>New Password</Form.Label>
                    <PasswordInput
                      label="New password"
                      autoComplete="new-password"
                      {...register('password')}
                      error={errors.password?.message}
                    />
                  </Form.Group>
                  <Form.Group className="form-group">
                    <Form.Label>Confirm Password</Form.Label>
                    <PasswordInput
                      label="Confirm new password"
                      autoComplete="new-password"
                      {...register('confirmPassword')}
                      error={errors.confirmPassword?.message}
                    />
                  </Form.Group>
                  <Form.Group className="form-group py-3 d-flex w-100">
                    <Button id="auth-change" type="submit" variant="primary">
                      Change
                    </Button>

                    <Button
                      id="auth-reset"
                      type="button"
                      variant="outline-danger"
                      className="ms-auto"
                      onClick={() => reset()}
                    >
                      Reset
                    </Button>
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default ChangePassword;
