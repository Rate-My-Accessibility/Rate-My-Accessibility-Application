'use client';

import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stuff } from '@prisma/client';
import { EditStuffSchema } from '@/lib/validationSchemas';
import { editStuff } from '@/lib/dbActions';

const onSubmit = async (data: Stuff) => {
  // console.log(`onSubmit data: ${JSON.stringify(data, null, 2)}`);
  await editStuff(data);
  swal('Success', 'Your item has been updated', 'success', {
    timer: 2000,
  });
};

const EditStuffForm = ({ stuff }: { stuff: Stuff }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Stuff>({
    resolver: yupResolver(EditStuffSchema),
    defaultValues: {
    id: stuff.id,
    name: stuff.name,
    location: stuff.location,
    feature: stuff.feature,
    quantity: stuff.quantity,
    owner: stuff.owner,
  },
  });
  // console.log(stuff);

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center">
            <h2>Edit Suggestion</h2>
          </Col>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" {...register('id')} value={stuff.id} />
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
                    {...register('quantity', { valueAsNumber: true })}
                    className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.quantity?.message}</div>
                </Form.Group>
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

export default EditStuffForm;
