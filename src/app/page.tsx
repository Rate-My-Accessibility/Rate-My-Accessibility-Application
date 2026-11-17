import { Button, Col, Container, Row, Stack } from 'react-bootstrap';

/** The Home page. */
const LandingPage = () => (
  <main className="d-flex flex-grow-1 align-items-start">
    <Container
  id="landing-page"
  fluid
  style={{ paddingTop: '150px' }}
>
      <Row className="justify-content-center text-center">
        <Col xs={12}>
          <h1> Rate My Accessibility</h1>
          <h5>Sign in to view and rate your campus&apos;s  </h5>
          <h5>Accessibility features</h5>
          <div className="d-flex justify-content-center flex-wrap gap-3 mt-4">
            <Button href="/auth/signin" variant="rounded-circle" id="sign-in-button">
              Sign In
            </Button>
            <Button href="/auth/signup" variant="rounded-circle" id="sign-up-button">
              Sign Up Now!
            </Button>
          </div>
        </Col>
      </Row>
      <Row style={{ marginTop: '300px' }} className="justify-content-center text-center">
        <Col>

        <h1><strong>JOIN THE RMA FAMILY NOW!</strong></h1>
        <h2>Love RMA? Let's Make It Official</h2>

        </Col>
</Row>

<Row style={{ marginTop: '200px' }}>
  <Col>Test</Col>
</Row>

<Row style={{ marginTop: '200px' }}>
  <Col>Test</Col>
</Row>
    
     
    </Container>
  </main>
);

export default LandingPage;