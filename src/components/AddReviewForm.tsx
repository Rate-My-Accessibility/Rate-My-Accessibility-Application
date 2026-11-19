'use client';

import { useSession } from 'next-auth/react'; // v5 compatible
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { redirect } from 'next/navigation';
import { addReview } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AddReviewSchema } from '@/lib/validationSchemas';



type AddReviewFormProps = {
  onCancel: () => void;
};



const AddReviewForm = ({ onCancel } : AddReviewFormProps) => {
  const onSubmit = async (data: { name: string; content: string; owner: string }) => {
  // console.log(`onSubmit data: ${JSON.stringify(data, null, 2)}`);
  await addReview(data);
  swal('Success', 'Your item has been added', 'success', {
    timer: 1000,
    buttons: [false],
  });

  onCancel();
  };

  const { data: session, status } = useSession();
  // console.log('AddStuffForm', status, session);
  const currentUser = session?.user?.email || '';
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AddReviewSchema),
  });
  if (status === 'loading') {
    return <LoadingSpinner />;
  }
  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  return (
    <Container>
      <Card>
        <Card.Header className="text-center">
          <h2>Add Review</h2>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <input
                type="text"
                {...register('name')}
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.name?.message}</div>
            </Form.Group>
            <Form.Group>
              <Form.Label>Review</Form.Label>
              <textarea
                {...register('content')}
                className={`form-control ${errors.content ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.content?.message}</div>
            </Form.Group>
            <input type="hidden" {...register('owner')} value={currentUser} />
            <Form.Group className="form-group">
              <Row className="pt-3">
                <Col>
                  <Button type="submit" variant="primary">
                    Submit
                  </Button>
                </Col>
                <Col>
                  <Button
                    onClick={onCancel}
                    type="button"
                  >
                    Cancel
                  </Button >
                </Col>
              </Row>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddReviewForm;
