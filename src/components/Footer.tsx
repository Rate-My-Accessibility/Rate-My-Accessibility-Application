import { Col, Container, Row } from 'react-bootstrap';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
   <footer className="rockets-footer">
     

        <div className="footer-bottom">
          <Container fluid>
            <p>
              <strong>
                 All rights reserved.
              </strong>
            </p>
            <p>
              <a href="#">Privacy Policy</a>　|　
              <a href="#">Terms of Use</a>　|　
              <a href="#">Customer Support</a>　|　
              <a href="#">Accessibility and Closed Captions</a>　|　
              <a href="#">Do Not Sell My Personal Information</a>
            </p>
            <p>
              <a href="#">Cookie Policy</a>　|　
              <a href="#">EEA/UK Privacy Statement</a>　|　
              <a href="#">Brazil Privacy Statement</a>　|　
              <a href="#">California Consumer Privacy Statement</a>　|　
              <a href="#">Colorado Consumer Privacy Statement</a>
            </p>
            <p>
              If you are having difficulty accessing any content on this website,
              please visit our Accessibility page.
            </p>
          </Container>
        </div>
      </footer>
  
);

export default Footer;
