import React, { Component } from "react";

// 1. columns
// 2. sortOrderAssimilation
// 3. sortColumn
class TableHeader extends Component {
  sortOrderAssimilation = (path) => {
    const sortColumn = { ...this.props.sortColumn };

    if (sortColumn.path === path) {
      console.log(sortColumn.path, sortColumn.order);
      sortColumn.order = sortColumn.order === "asc" ? "desc" : "asc";
    } else {
      sortColumn.path = path;
      sortColumn.order = "asc";
    }

    this.props.onSort(sortColumn);
  };

  renderSortIcon(column) {
    const { sortColumn } = this.props;
    if (column.path !== sortColumn.path) {
      return null;
    }
    if (sortColumn.order === "asc") {
      return <i className="fa fa-sort-asc" aria-hidden="true"></i>;
    }
    return <i className=" fa fa-sort-desc"></i>;
  }

  render() {
    const { columns } = this.props;
    return (
      <thead>
        <tr className="table-dark">
          {columns.map((column) => (
            <th
              className="clickable"
              key={column.path || column.key}
              onClick={() => this.sortOrderAssimilation(column.path)}
              scope="col"
            >
              {column.label}
              {this.renderSortIcon(column)}
            </th>
          ))}
        </tr>
      </thead>
    );
  }
}

export default TableHeader;
