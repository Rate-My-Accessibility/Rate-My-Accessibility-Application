'use client';

import { Review, Photo } from '@prisma/client';
import { Card, Row, Col, Carousel, Image } from 'react-bootstrap';

const MyReviewCard = ({ review, photos } : { review : Review; photos: Photo[] }) => (
    <Card className='h-100'>
        <Card.Header>
            <Row>
                <Col>
                    <Card.Title>{review.placeName}</Card.Title>
                    <Card.Subtitle>{review.createdAt.toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})}</Card.Subtitle>
                </Col>
                <Col>
                    <Card.Title className='text-end'>-{review.owner}</Card.Title>
                </Col>
            </Row>
        </Card.Header>
        {(photos.length > 0) && (
            <>
            <Card.Body>
                <Carousel interval={null} slide={false}>
                    {photos.map((photo) => (
                        <Carousel.Item key={photo.id}>
                            <Image 
                            src={photo.source} alt="" 
                            className="d-block mx-auto" 
                            style={{ maxHeight: 300, width: 'auto', maxWidth: '100%' }}
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>
            </Card.Body>
            <hr className="mt-0"/>
            </>
        )}
        <Card.Body>
            <Card.Text>{review.content}</Card.Text>
        </Card.Body>
    </Card>
);

export default MyReviewCard;

    