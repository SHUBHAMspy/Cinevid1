import React, { Component } from "react";
import { Link } from "react-router-dom";
import authenticationService from "../services/authenticationService";
import Like from "./reusables/likeComponent";
import Table from "./reusables/table";

class MoviesTable extends Component {
  columns = [
    {
      path: "title",
      label: "Movie Name",
      content: (movie) => (
        <Link to={`/movies/${movie._id}`}>{movie.title}</Link>
      ),
    },
    { path: "genre.name", label: "Genre" },
    { path: "numberInStock", label: "Stock" },
    { path: "dailyRentalRate", label: "Rate" },
  ];

  likeColumn = {
    key: "like",
    content: (movie) => (
      <Like liked={movie.liked} onClick={() => this.props.onLike(movie)} />
    ),
  };

  deleteColumn = {
    key: "delete",
    content: (movie) => (
      <button
        onClick={() => this.props.onDelete(movie)}
        className="btn btn-danger btn-sm btn-responsive"
      >
        Delete
      </button>
    ),
  };

  constructor() {
    super();
    const user = authenticationService.getCurrentUser();
    if (user) {
      this.columns.push(this.likeColumn);
    }
    if (user && user.isAdmin) {
      this.columns.push(this.deleteColumn);
    }
  }

  render() {
    const { movies, onSort, sortColumn } = this.props;

    return (
      <Table
        data={movies}
        columns={this.columns}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default MoviesTable;
