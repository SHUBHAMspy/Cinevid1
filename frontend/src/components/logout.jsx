import React from "react";
import { logout } from "../services/authenticationService";

class Logout extends React.Component {
  componentDidMount() {
    logout();
    window.location = "/";
  }
  render() {
    return null;
  }
}

export default Logout;
