import _ from "lodash";
import React, { Component } from "react";

//1.movies
//2.onLike
//3.Like Component
//4.button element

class TableBody extends Component {
  renderCell = (item, column) => {
    if (column.content) {
      return column.content(item);
    }
    return _.get(item, column.path); // we have to print the target property here and not the path to it
  };

  createKey = (item, column) => {
    return item._id + (column.path || column.key);
  };
  render() {
    const { data, columns } = this.props; // any data will come and we have to render that
    return (
      <tbody>
        {data.map((item) => (
          <tr key={item._id}>
            {columns.map((column) => (
              <td key={this.createKey(item, column)}>
                {this.renderCell(item, column)}
              </td> // get the target property similar or corresponding to the path
            ))}
          </tr>
        ))}
      </tbody>
    );
  }
}

export default TableBody;
