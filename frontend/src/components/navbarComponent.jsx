import React from "react";
//import { Link, NavLink } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
const NavBar = ({ user }) => {
  return (
    <Navbar variant="dark" bg="dark" expand="md">
      <Container>
        <Navbar.Brand href="/movies">CineVid</Navbar.Brand>
        <Navbar.Toggle aria-controls="offcanvasNavbar" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/movies">Movies</Nav.Link>
            {user && user.isAdmin && (
              <Nav.Link href="/customers">Customers</Nav.Link>
            )}
            {user && <Nav.Link href="/rentals">Rentals</Nav.Link>}
          </Nav>

          <Nav>
            {!user && (
              <React.Fragment>
                <Nav.Link href="/loginForm">Login</Nav.Link>

                <Nav.Link href="/register">Register</Nav.Link>
              </React.Fragment>
            )}

            {user && (
              <React.Fragment>
                <Nav.Link href="/me">{user.name}</Nav.Link>

                <Nav.Link href="/logout">Logout</Nav.Link>
              </React.Fragment>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
