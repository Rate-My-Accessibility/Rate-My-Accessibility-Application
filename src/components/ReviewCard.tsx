'use client';

import { OldReview } from '@prisma/client';
import { Card, Row, Col } from 'react-bootstrap';

const ReviewCard = ({review} : { review : OldReview }) => (
    <Card className='h-100'>
        <Card.Header>
            <Row>
                <Col>
                    <Card.Title>{review.name}</Card.Title>
                    <Card.Subtitle>{review.createdAt.toLocaleDateString('en-US')}</Card.Subtitle>
                </Col>
                <Col>
                    <Card.Title className='text-end'>-{review.owner}</Card.Title>
                </Col>
            </Row>
        </Card.Header>
        <Card.Body>
            <Card.Text>{review.content}</Card.Text>
        </Card.Body>
    </Card>
);

export default ReviewCard;

    