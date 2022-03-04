import Joi from "joi";
import { Component } from "react";
import Input from "../inputComponent";
import Select from "../reusables/selectComponent";

class Form extends Component {
  state = {
    data: {},
    errors: {},
  };

  validate = () => {
    const { data } = this.state; // You are using already setted data which is set when handle chane was called so that afterwards whole data will be validated
    const options = { abortEarly: false };
    const result = this.formSchema.validate(data, options);
    console.log(result);

    if (!result.error) return null;

    const errors = {};

    result.error.details.map((item) => (errors[item.path[0]] = item.message));
    return errors;

    // const errors = {};

    // if (data.userEmail.trim() === "") {
    //   errors.userEmail = "Email cannot be empty";
    // }
    // if (data.userPassword.trim() === "") {
    //   errors.userPassword = "Password cannot be empty";
    // }

    // return Object.keys(errors).length === 0 ? {} : errors;
  };

  validateIndividualInput = ({ name, value }) => {
    console.log(name);
    const obj = { [name]: value };
    console.log(obj);
    const individualSchema = Joi.object({ [name]: this.schema[name] });
    const result = individualSchema.validate(obj);

    return result.error ? result.error.details[0].message : null;

    // if (name === "userEmail") {
    //   // So we will write all the validation rules associated with this input

    //   //1.
    //   if (value.trim() === "") return "Email cannot be empty";

    //   //... Other Rules
    // }

    // if (name === "userPassword") {
    //   // So we will write all the validation rules associated with this input
    //   //1.
    //   if (value.trim() === "") return "Password cannot be empty";

    //   //... Other Rules
    // }
  };

  handleChange = ({ currentTarget: input, target }) => {
    const errors = { ...this.state.errors };
    console.log(input);
    console.log(target);
    const errorMessage = this.validateIndividualInput(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data, errors });
  };

  handleFormSubmit = (e) => {
    e.preventDefault(); // this event's default behaviour will be supressed

    const errors = this.validate(); // if validate happens then 2things will be there if errors happens or noti.e will be an empty object
    console.log(errors);
    this.setState({ errors: errors || {} });

    if (errors) {
      return;
    }

    // if (!this.save && this.customerform) {
    //   console.log(this.save);
    //   this.rentNow();

    //   return;
    // }

    if (!this.save && this.movieform) {
      console.log(this.save);
      this.rentIt();

      return;
    }

    this.submitIt();
  };

  renderInput = (name, label, type = "text") => {
    const { data, errors } = this.state;

    return (
      <Input
        name={name}
        label={label}
        value={data[name]}
        type={type}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  };

  renderButton = (label, save = true) => {
    save = label === "Rent It" || "Rent Now" ? false : true;

    return (
      <div>
        <button
          disabled={this.validate()}
          type="submit"
          className={
            label === "Rent It" ? "btn btn-success" : "btn btn-primary"
          }
        >
          {label}
        </button>
      </div>
    );
  };

  renderDropdown = (name, label, options, movieform) => {
    const { data, errors } = this.state;
    return (
      <Select
        name={name}
        label={label}
        value={data[name]}
        options={options}
        error={errors[name]}
        onChange={this.handleChange}
      />
    );
  };

  renderToggleButton = (name, label) => {
    const { data, errors } = this.state;

    return (
      <label>
        {label}
        <input
          type="checkbox"
          value={data[name]}
          onChange={this.handleToggle}
          checked={data[name] === name}
          name={name}
          error={errors[name]}
        />
      </label>
    );
  };

  handleToggle = (e) => {
    const value = e.target.value;
    const errors = { ...this.state.errors };
    const errorMessage = this.validateIndividualInput(e.target);
    if (errorMessage) errors[e.target.name] = errorMessage;
    else delete errors[e.target.name];

    const data = { ...this.state.data };
    data[e.target.name] = !data[e.target.name];
    this.setState({ data, errors });
  };
}

export default Form;
