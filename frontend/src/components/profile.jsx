import Joi from "joi";
import React from "react";
import { withRouter } from "react-router";
import authenticationService from "../services/authenticationService";
import * as userService from "../services/userService";
import Form from "./reusables/formComponent";

class Profile extends Form {
  state = {
    data: {
      userEmail: "",
      userPassword: "",
      confirmUserPassword: "",
      userName: "",
    },
    errors: {},
  };

  async componentDidMount() {
    const { data: user } = await userService.getUserProfile(
      authenticationService.getCurrentUser()
    );
    const data = { ...this.state.data };
    data.userEmail = user.email;
    data.userName = user.name;
    this.setState({ data });
    // const errors = this.validateProfile();
    // this.setState({ errors: errors || {} });
    // if (errors) return;
    console.log(this.state);
  }

  schema = {
    userEmail: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("Email"),
    userPassword: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .label("Password")
      .allow(""),
    confirmUserPassword: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .label("Confirm Password")
      .allow(""),
    userName: Joi.string().required().label("Name"),
  };

  formSchema = Joi.object(this.schema);

  submitIt = async () => {
    // Calling the server for data
    try {
      const response = await userService.updateUser(this.state.data);
      console.log("Form Submitted");

      window.location = "/";
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.userEmail = error.response.data;
        this.setState({ errors });
      }
    }
  };

  // validateProfile = () => {
  //   const options = { abortEarly: false };

  //   console.log(this.formSchema);
  //   const { error, value } = this.formSchema.validate(this.state.data, options);
  //   console.log(value);
  //   if (!error) return null;

  //   const errors = {};
  //   for (let item of error.details) errors[item.path[0]] = item.message;
  //   return errors;
  // };

  // validateProfileProperty = ({ name, value }) => {
  //   const obj = { [name]: value };
  //   const schema = Joi.object({ [name]: this.schema[name] });
  //   const { error } = schema.validate(obj);
  //   return error ? error.details[0].message : null;
  // };

  // handleChange = ({ currentTarget: input }) => {
  //   const errors = { ...this.state.errors };
  //   const error = this.validateProfileProperty(input);
  //   if (error) errors[input.name] = error;
  //   else delete errors[input.name];

  //   const data = { ...this.state.data };
  //   data[input.name] = input.value;
  //   this.setState({ data, errors });
  // };

  // handleSubmit = (e) => {
  //   e.preventDefault();

  //   const errors = this.validateProfile();
  //   this.setState({ errors: errors || {} });
  //   if (errors) return;

  //   this.submitIt();
  // };

  render() {
    console.log(this.props);
    // const { userEmail, userName, userPassword, confirmUserPassword } =
    //   this.state.data;
    return (
      <div>
        <h1>Your Profile</h1>
        <form onSubmit={this.handleFormSubmit}>
          {/* <Input
            name={"userEmail"}
            label={"Email"}
            value={userEmail}
            type={"text"}
            onChange={this.handleChange}
            error={this.state.errors.userEmail}
          />
          <Input
            name={"userPassword"}
            label={"Password"}
            value={userPassword}
            type={"password"}
            onChange={this.handleChange}
            error={this.state.errors.userPassword}
          />
          <Input
            name={"confirmUserPassword"}
            label={"Confirm Password"}
            value={confirmUserPassword}
            type={"password"}
            onChange={this.handleChange}
            error={this.state.errors.confirmUserPassword}
          />
          <Input
            name={"userName"}
            label={"Name"}
            value={userName}
            type={"text"}
            onChange={this.handleChange}
            error={this.state.errors.userName}
          />

          <button
            disabled={this.validateProfile()}
            type="submit"
            className="btn btn-primary"
          >
            Update
          </button> */}
          {this.renderInput("userEmail", "Email")}
          {this.renderInput("userPassword", "Password", "password")}
          {this.renderInput(
            "confirmUserPassword",
            "Confirm Password",
            "password"
          )}
          {this.renderInput("userName", "Name")}

          {this.renderButton("Update")}
        </form>
      </div>
    );
  }
}

export default withRouter(Profile);
