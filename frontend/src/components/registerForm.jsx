import Joi from "joi";
import React from "react";
import { withRouter } from "react-router";
import { loginWithJwt } from "../services/authenticationService";
import * as userService from "../services/userService";
import Form from "./reusables/formComponent";

class Register extends Form {
  state = {
    data: { userEmail: "", userPassword: "", userName: "" },
    errors: {},
  };

  schema = {
    userEmail: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("Email"),
    userPassword: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required()
      .label("Password"),
    userName: Joi.string().required().label("Name"),
  };

  formSchema = Joi.object(this.schema);

  submitIt = async () => {
    // Calling the server for data
    try {
      const response = await userService.register(this.state.data);
      console.log("Form Submitted");
      loginWithJwt(response.headers["auth-token"]);
      window.location = "/";
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.userEmail = error.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <div>
        <h1>Register</h1>
        <form onSubmit={this.handleFormSubmit}>
          {this.renderInput("userEmail", "Email")}
          {this.renderInput("userPassword", "Password", "password")}
          {this.renderInput("userName", "Name")}

          {this.renderButton("Register")}
        </form>
      </div>
    );
  }
}

export default withRouter(Register);
