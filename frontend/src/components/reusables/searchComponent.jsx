import React from "react";

const SearchBar = ({ onChange, value }) => {
  //we don't want  it to have its own indigenous state to govern itself rather we want to control it(by overriding its elemental state) and manage the information it is getting and handle whatever is happening to it or will happen to it

  return (
    <div className="mb-3">
      <input
        onChange={(e) => onChange(e.target.value)}
        value={value}
        className="form-control"
        type="text"
        placeholder="Search"
        aria-label="Search"
      ></input>
    </div>
  );
};

export default SearchBar;
