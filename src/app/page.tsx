import { Button, Col, Container, Row } from 'react-bootstrap';

/** The Home page. */
const Home = () => (
  <main className="d-flex flex-grow-1 align-items-center">
    <Container id="landing-page" fluid className="py-3">
      <Row className="justify-content-center text-center">
        <Col xs={12}>
          <h1> Rate My Accessibility</h1>
          <h5>Sign in to view and rate your campus&apos;s  </h5>
          <h5>Accessibility features</h5>
          <div className="d-flex justify-content-center flex-wrap gap-3 mt-4">
            <Button href="/auth/signin" variant="primary" id="sign-in-button">
              Sign In
            </Button>
            <Button href="/auth/signup" variant="outline-primary" id="sign-up-button">
              Sign Up Now!
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  </main>
);

export default Home;
