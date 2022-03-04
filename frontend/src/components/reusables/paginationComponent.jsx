import _ from "lodash";
import React, { Component } from "react";

class Pagination extends Component {
  render() {
    const { noOfItems, pageSize, currentPage, onPageChange } = this.props;
    const noOfPages = Math.ceil(noOfItems / pageSize);

    if (noOfPages === 1) {
      return null;
    }

    const pages = _.range(1, noOfPages + 1); // this is nothing but a list of page nos

    return (
      <nav>
        <ul className="pagination pagination-sm justify-content-center">
          {pages.map((page) => (
            <li
              key={page}
              className={
                page === currentPage ? "page-item active" : "page-item"
              }
              aria-current="page"
            >
              <span className="page-link" onClick={() => onPageChange(page)}>
                {page}
              </span>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}

export default Pagination;
