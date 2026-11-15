'use client';

import { useSession } from 'next-auth/react'; // v5 compatible
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { redirect } from 'next/navigation';
import { addStuff } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AddStuffSchema } from '@/lib/validationSchemas';

const onSubmit = async (data: { name: string; quantity: number; owner: string; feature: string, location: string }) => {
  // console.log(`onSubmit data: ${JSON.stringify(data, null, 2)}`);
  await addStuff(data);
  swal('Success', 'Your suggestion has been added', 'success', {
    timer: 2000,
  });
};



const AddSuggestion: React.FC = () => {
  const { data: session, status } = useSession();
  // console.log('AddStuffForm', status, session);
  const currentUser = session?.user?.email || '';
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AddStuffSchema),
  });
  if (status === 'loading') {
    return <LoadingSpinner />;
  }
  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center">
            <h2>Add Suggestion</h2>
          </Col>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group>
                  <Form.Label>Building:</Form.Label>
                  <Row>
                    <Col>
                      <Form.Label>Name</Form.Label>
                      <input
                      type="text"
                      {...register('name')}
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.name?.message}</div>
                    </Col>
                    <Col>
                      <Form.Label>Location</Form.Label>
                      <input
                      type="text"
                      {...register('location')}
                      className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.location?.message}</div>
                    </Col>
                  </Row>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Feature</Form.Label>
                  <select {...register('feature')} className={`form-control ${errors.feature ? 'is-invalid' : ''}`}>
                    <option value="elevator">Elevator</option>
                    <option value="stair">Stair</option>
                    <option value="ramp">Ramp</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="invalid-feedback">{errors.feature?.message}</div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Amount In Building</Form.Label> {/*idk*/}
                  <input
                    type="number"
                    {...register('quantity')}
                    className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.quantity?.message}</div>
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
                      <Button type="button" onClick={() => reset()} variant="warning" className="float-right">
                        Reset
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddSuggestion;
