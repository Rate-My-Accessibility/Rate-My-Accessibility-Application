'use client';

import AddReviewForm from '@/components/AddReviewForm';
import { Button, Modal, Container} from 'react-bootstrap';
import { useState } from 'react';


const ReviewButton = () => {
  const [show, setShow] = useState(false);
  return (
    <main>
        <Container>
             <h1>Submit a Review</h1>
        </Container>
       
        <Button onClick={() => setShow(true)} variant="primary" className="rounded-circle">
            Add Review
        </Button>

        <Modal show={show} onHide={() => setShow(false)} centered>
            <Modal.Body>
                <AddReviewForm onCancel={() => setShow(false)} />
            </Modal.Body>
        </Modal>
    </main>
  );
};

export default ReviewButton;


