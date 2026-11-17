import { Button, Col, Container, Row } from 'react-bootstrap';

/** The Home page. */
const Home = () => (
  <main className="d-flex flex-grow-1 align-items-center">
    <Container id="landing-page" fluid className="py-3">
      <Row className="justify-content-center text-center">
        <Col xs={12}>
          <h1> Rate My Accessibility</h1>
          <h5>Welcome to the Rating Page</h5>
          <h5>Accessibility features</h5>
         
        </Col>
      </Row>
    </Container>
  </main>
);

export default Home;
