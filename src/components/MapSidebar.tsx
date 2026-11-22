'use client';

import { Elevator, Review } from '@prisma/client';
import { Tab, Tabs, Row, Col, Button, Container, ListGroup } from 'react-bootstrap';
import ReviewButton from '@/components/ReviewButton';
import SidebarReview from './SidebarReview';

type MapSideBarProps = {
    elevator: Elevator | null;
    reviews: Review[];
    onClose: () => void;
}

const MapSidebar = ({elevator, reviews, onClose} : MapSideBarProps) => {

    const reviewTitle = elevator?.location ?? "N/A";
    reviews = reviews.filter(review => (review.elevatorId === elevator?.id))

    return (
        <>
        <Row className='p-2'>
            <Col>
                <h3>{reviewTitle}</h3>
            </Col>
            <Col xs="auto">
                <Button onClick={onClose} className="align-self-end">
                    Close
                </Button>        
            </Col>
    
        </Row>
        

        <Tabs 
          defaultActiveKey="overview"
          fill
        >
            <Tab eventKey="overview" title="Overview">
                Tab for overview
            </Tab>
            <Tab eventKey="reviews" title="Reviews">
                <Container className='py-2 d-flex justify-content-center'>
                    <ReviewButton elevator={elevator}/>
                </Container>
                <hr className='mt-0'/>
                <ListGroup variant='flush'>
                    {reviews.map((item) =>
                        <SidebarReview key={item.id} review={item}/>
                    )}
                </ListGroup>

            </Tab>
        </Tabs>    
        </>

    );
}

export default MapSidebar