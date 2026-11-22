'use client';

import { useSession } from 'next-auth/react'; // v5 compatible
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { redirect } from 'next/navigation';
import { addReview, addPhoto } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AddReviewSchema, AddPhotoSchema } from '@/lib/validationSchemas';
import { uploadImage } from '@/actions/uploadImage';
import { Elevator } from '@prisma/client';



type AddReviewFormProps = {
  elevator: Elevator | null;
  onCancel: () => void;
};

const CombinedSchema = AddReviewSchema.concat(AddPhotoSchema.omit(['reviewId']));

const AddReviewForm = ({ elevator, onCancel } : AddReviewFormProps) => {
  const { data: session, status } = useSession();
  // console.log('AddStuffForm', status, session);
  const currentUser = session?.user?.email || '';
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CombinedSchema),
  });
  if (status === 'loading') {
    return <LoadingSpinner />;
  }
  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }
  
  const onSubmit = async (data: { placeName: string; content: string; owner: string; source?: FileList;}) => {
  // console.log(`onSubmit data: ${JSON.stringify(data, null, 2)}`);
    const review = await addReview({
      placeName: data.placeName,
      content: data.content,
      owner: data.owner,
      elevatorId: elevator?.id ?? null,
    });

    const files = Array.from(data.source ?? []);
    const uploadedPhotos = await Promise.all(
      files.map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const result = await uploadImage(formData);
        if ('error' in result) {
          throw new Error(result.error);
        }

        return result.url;
      })
    );

    await Promise.all(
      uploadedPhotos.map((url) => 
        addPhoto({
          source: url,
          reviewId: review.id,
          owner: data.owner,
          elevatorId: elevator?.id ?? null,
        }),
      ),
    );

    swal('Success', 'Your item has been added', 'success', {
      timer: 1000,
      buttons: [false],
    });

    onCancel();
  };  



  return (

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
                {...register('placeName')}
                className={`form-control ${errors.placeName ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.placeName?.message}</div>
            </Form.Group>
            <Form.Group>
              <Form.Label>Review</Form.Label>
              <textarea
                {...register('content')}
                className={`form-control ${errors.content ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.content?.message}</div>
            </Form.Group>
            <Form.Group>
              <Form.Label>Add Photos</Form.Label>
              <input
                id="photos"
                type="file"
                accept='image/*'
                multiple
                {...register('source')}
                className={`form-control ${errors.source ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.source?.message}</div>
            </Form.Group>
            <input type="hidden" {...register('owner')} value={currentUser} />
            <input type="hidden" {...register('elevatorId')} value={elevator?.id} />
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

  );
};

export default AddReviewForm;
