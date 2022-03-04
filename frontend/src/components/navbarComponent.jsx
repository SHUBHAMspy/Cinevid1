import React from "react";
import { Link, NavLink } from "react-router-dom";

const NavBar = ({ user }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          CineVid
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <NavLink className="nav-link " aria-current="page" to="/movies">
              Movies
            </NavLink>

            {user && user.isAdmin && (
              <NavLink className="nav-link" to="/customers">
                Customers
              </NavLink>
            )}

            {user && (
              <NavLink className="nav-link" to="/rentals">
                Rentals
              </NavLink>
            )}

            {!user && (
              <React.Fragment>
                <NavLink className="nav-link" to="/loginForm">
                  Login
                </NavLink>

                <NavLink className="nav-link" to="/register">
                  Register
                </NavLink>
              </React.Fragment>
            )}

            {user && (
              <React.Fragment>
                <NavLink className="nav-link" to="/me">
                  {user.name}
                </NavLink>

                <NavLink className="nav-link" to="/logout">
                  Logout
                </NavLink>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
