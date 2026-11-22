'use client';

import AddReviewForm from '@/components/AddReviewForm';
import { Button, Modal } from 'react-bootstrap';
import { useState } from 'react';
import { Elevator } from '@prisma/client';


const ReviewButton = ({ elevator } : { elevator : Elevator | null}) => {
  const [show, setShow] = useState(false);
  return (
    <main>
        <Button onClick={() => setShow(true)}>
            Add Review
        </Button>

        <Modal show={show} onHide={() => setShow(false)} centered>

            <AddReviewForm elevator={elevator} onCancel={() => setShow(false)} />

        </Modal>
    </main>
  );
};

export default ReviewButton;


