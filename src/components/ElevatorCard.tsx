'use client';

import { Elevator } from '@prisma/client';
import { Card, Image, Col } from 'react-bootstrap';

/** Renders a single elevator card in the List Elevators page. See list/page.tsx. */
const ElevatorCard = ({ name, photos, scores }: Elevator) => {
  // order: [speed, size, availability, crowding, reliability, cleanliness]
  const weights = [0.25, 0.1, 0.2, 0.1, 0.25, 0.1];
  const accessScore =
    scores.length > 0
      ? scores.reduce((acc, score, i) => acc + score * weights[i], 0)
      : NaN;
  return (
    <Col className="col-3 mb-3">
      <Card className="h-100">
        <Card.Header
          style={{ height: '260px' }}
          className="d-flex justify-content-center align-items-center p-0"
        >
          <Image
            src={`/${photos[0]}`}
            alt={name + ' elevator'}
            style={{ borderRadius: '0.25rem 0.25rem 0 0' }}
            className="w-100 h-100 object-fit-cover"
          />
        </Card.Header>
        <Card.Body>
          <h5>{name} Elevator</h5>
          <hr />
          {isNaN(accessScore) ? (
            <p>AccessScore: N/A</p>
          ) : (
            <p>AccessScore: {accessScore.toFixed(2)}</p>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};
export default ElevatorCard;
