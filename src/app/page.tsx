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
            <Button href="/auth/signin" id="sign-in-button">
              Sign In
            </Button>
            <Button href="/auth/signup" id="sign-up-button">
              Sign Up Now!
            </Button>
          </div>
        </Col>
      </Row>
      <Row style={{ marginTop: '300px', backgroundColor: 'rgb(0, 71, 48)',  }} className="justify-content-center text-center text-white py-5">
        <Col>
        
        <h1><strong>Think The Campus Can Be Improved?</strong></h1>
        <h2>Make Your Voice Heard!</h2>

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