import Joi from "joi";
import React from "react";
import { Redirect, withRouter } from "react-router";
import authenticationService, {
  login,
} from "../services/authenticationService";
import Form from "./reusables/formComponent";

class LoginForm extends Form {
  state = {
    data: { userEmail: "", userPassword: "" }, // any data i.e  the current one
    errors: {},
  };

  // userEmail = React.createRef(); // Now we are creating a reference(a ref object) and this reference will be linked to a real dom element
  schema = {
    userEmail: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("Email"),
    userPassword: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required()
      .label("Password"),
  };

  formSchema = Joi.object(this.schema);

  submitIt = async () => {
    // Calling the server for data
    try {
      const { data } = this.state;
      await login(data.userEmail, data.userPassword);
      console.log("Form Submitted");

      const { state } = this.props.location;
      //console.log(state);
      window.location = state ? state.from.pathname : "/";
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.userEmail = error.response.data;
        this.setState({ errors });
      }
    }
    //const userEmail = this.userEmail.current.value;
  };

  render() {
    if (authenticationService.getCurrentUser()) return <Redirect to="/" />;
    return (
      <div>
        <h1>Login Form</h1>
        <form onSubmit={this.handleFormSubmit}>
          {this.renderInput("userEmail", "Email")}
          {this.renderInput("userPassword", "Password", "password")}
          {this.renderButton("Login")}
        </form>
      </div>
    );
  }
}

export default withRouter(LoginForm);
