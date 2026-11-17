'use client';

import AddReviewForm from '@/components/AddReviewForm';
import { Button, Modal } from 'react-bootstrap';
import { useState } from 'react';


const ReviewButton = () => {
  const [show, setShow] = useState(false);
  return (
    <main>
        <Button onClick={() => setShow(true)}>
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


