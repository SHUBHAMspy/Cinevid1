import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import CustomerForm from "./components/customerForm";
import Customers from "./components/customers";
import LoginForm from "./components/loginForm";
import Logout from "./components/logout";
import MovieForm from "./components/movieForm";
import Movies from "./components/movies";
import NavBar from "./components/navbarComponent";
import NotFound from "./components/notFound";
import Profile from "./components/profile";
import Register from "./components/registerForm";
import Rentals from "./components/rentals";
import ProtectedRoute from "./components/reusables/protectedRoute";
import authenticationService from "./services/authenticationService";

class App extends Component {
  state = {};

  componentDidMount() {
    const user = authenticationService.getCurrentUser();
    this.setState({ user });
  }

  render() {
    return (
      <React.Fragment>
        <NavBar user={this.state.user} />
        <h1>Welcome to CineVid Rental</h1>
        <div className="col-lg-8 mx-auto p-3 py-md-5">
          <Switch>
            <ProtectedRoute path="/movies/:id" component={MovieForm} />

            <ProtectedRoute path="/movies/new" component={MovieForm} />

            <ProtectedRoute path="/customerform" component={CustomerForm} />

            <Route path="/movies">
              <Movies user={this.state.user} />
            </Route>

            <Route path="/me">
              <Profile />
            </Route>

            <Route path="/customers">
              <Customers />
            </Route>

            <Route path="/rentals">
              <Rentals />
            </Route>

            <Route path="/notFound">
              <NotFound />
            </Route>

            <Route path="/loginForm">
              <LoginForm />
            </Route>

            <Route path="/logout">
              <Logout />
            </Route>

            <Route path="/register">
              <Register />
            </Route>

            <Redirect from="/" to="/movies"></Redirect>
          </Switch>
          <ToastContainer autoClose={5000} />
        </div>
      </React.Fragment>
    );
  }
}

export default App;
