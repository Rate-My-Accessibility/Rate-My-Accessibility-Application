'use client';

import { ListGroup } from 'react-bootstrap';
import { Review } from '@prisma/client';

const SidebarReview = ({ review } : { review: Review }) => (
    <ListGroup.Item>
        <p>{review.owner}</p>
        <p className='blockquote-footer'>
            {review.createdAt.toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})}
        </p>
        <p>{review.content}</p>
    </ListGroup.Item>
);

export default SidebarReview
