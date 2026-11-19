'use client';

import { useSession } from 'next-auth/react'; // v5 compatible
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown, Image, Button, NavLink } from 'react-bootstrap';
import { BoxArrowRight, Lock, PersonFill, PersonPlusFill, HeartFill } from 'react-bootstrap-icons';

const NavBar: React.FC = () => {
  const { data: session, status } = useSession();
  const pathName = usePathname();
  if (status === 'loading') return null;
  const currentUser = session?.user?.email;
  const role = session?.user?.role;
  return (  
   <Navbar bg="dark" expand="lg" variant="dark">
      <Container>
        <Navbar.Brand href={currentUser ? '/home' : '/'}>
        <Image src="/website_logo.png" alt="Logo" width="50" height="50" className="d-inline-block align-top" />


         
        </Navbar.Brand>

          
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto justify-content-start">
         
            <NavLink  id="list-stuff-nav" href="/about" active={pathName === '/about'}>
              About Us
              </NavLink>
               <NavLink >
              Contact Us
              </NavLink>
            {currentUser && (
              <>
                  <Nav.Link id="list-stuff-nav" href="/add" active={pathName === '/add'}>
                 Add a Review 
                </Nav.Link>
                  <Nav.Link id="list-stuff-nav" href="/list" active={pathName === '/list'}>
                  Browse All Reviews 
                </Nav.Link>
                  <Nav.Link id="list-stuff-nav" href="/list" active={pathName === '/list'}>
                  Campus Map
                </Nav.Link>
              </>
            )}
            {currentUser && role === 'ADMIN' && (
              <Nav.Link id="admin-stuff-nav" href="/admin" active={pathName === '/admin'}>
                Admin
              </Nav.Link>
            )}
          </Nav>
        <Nav className="ms-auto align-items-lg-center">
  {currentUser && (
    <Nav.Link href="/profile" active={pathName === '/profile'}>
      User Profile
    </Nav.Link>
  )}

  {session ? (
    <NavDropdown id="login-dropdown" title={currentUser}>
      <NavDropdown.Item
        id="login-dropdown-sign-out"
        href="/api/auth/signout"
      >
        <BoxArrowRight />
        Sign Out
      </NavDropdown.Item>

      <NavDropdown.Item
        id="login-dropdown-change-password"
        href="/auth/change-password"
      >
        <Lock />
        Change Password
      </NavDropdown.Item>
    </NavDropdown>
  ) : (
    <NavDropdown id="login-dropdown" title="Login">
      <NavDropdown.Item href="/auth/signin">
        <PersonFill />
        Sign in
      </NavDropdown.Item>

      <NavDropdown.Item href="/auth/signup">
        <PersonPlusFill />
        Sign up
      </NavDropdown.Item>
    </NavDropdown>
  )}
</Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
