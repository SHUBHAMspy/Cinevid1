import React from "react";

const Filter = ({ items, selectedItem, onItemSelect }) => {
  // To not to use props.something always we will use destructuring
  //const { items, selectedItem, onItemSelect } = props;
  return (
    <ul className="list-group  ">
      {items.map((item) => (
        <li
          key={item._id}
          onClick={() => onItemSelect(item)}
          className={
            selectedItem === item ? "list-group-item active" : "list-group-item"
          }
          style={{ cursor: "pointer" }}
        >
          {item.name}
        </li>
      ))}
    </ul>
  );
};

export default Filter;
