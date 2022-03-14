import Joi from "joi";
import React from "react";
import { withRouter } from "react-router";
import authenticationService from "../services/authenticationService";
import { addCustomer } from "../services/customerService";
import { rentMovie } from "../services/rentalService";
import Form from "./reusables/formComponent";
class CustomerForm extends Form {
  state = {
    data: {
      name: "",
      isGold: false,
      phoneNumber: "",
    },
    errors: {},
  };

  schema = {
    //_id: Joi.string(),
    name: Joi.string().required().label("Name"),
    isGold: Joi.boolean().label("GoldMember"),
    phoneNumber: Joi.string().required().min(10).label("Phone Number"),
  };
  formSchema = Joi.object(this.schema);

  componentDidMount() {
    const user = authenticationService.getCurrentUser();
    const data = { ...this.state.data };

    data.name = user.name;
    this.setState({ data });
  }

  // rentNow = async () => {
  //   await rentMovie(customerId, movieId);
  //   console.log("Form Submitted");
  // };
  submitIt = async () => {
    // Calling the server for data
    const { userId, movieId } = this.props.history.location.state;
    //console.log(this.state.data);
    const customer = await addCustomer(this.state.data, userId);
    //console.log(customer);

    await rentMovie(customer.data._id, movieId);
    console.log("Form Submitted");
    this.props.history.push("/movies");
  };

  render() {
    const user = authenticationService.getCurrentUser();
    //console.log(this.props.history.location.state);
    //console.log(this.props);
    return (
      <>
        <h3>Hello Customer </h3>
        <form onSubmit={this.handleFormSubmit}>
          {this.renderInput("name", "Name")}
          {this.renderInput("phoneNumber", "Phone")}
          <b>Want to be GoldMember</b>
          {this.renderToggleButton(
            "isGold",
            "Want to be GoldMember",
            this.state.data.isGold
          )}

          {user && this.renderButton("Rent Now")}
        </form>
      </>
    );
  }
}

export default withRouter(CustomerForm);
