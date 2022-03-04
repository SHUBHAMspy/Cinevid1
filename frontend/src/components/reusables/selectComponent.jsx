import React from "react";
const Select = ({ name, label, options, error, ...rest }) => {
  console.log(options);
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <select
        {...rest}
        name={name}
        className="form-select"
        id={name}
        aria-label="Default select example"
      >
        <option value="" />
        {options.map((option) => (
          <option key={option._id} value={option._id}>
            {option.name || option}
          </option>
        ))}
        {/* <option selected>Open this select menu</option>
        <option value="1">Action</option>
        <option value="2">Comedy</option>
        <option value="3">Thriller</option> */}
      </select>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Select;
