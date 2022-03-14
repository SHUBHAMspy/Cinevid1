import _ from "lodash";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getGenres } from "../services/genreService";
import { deleteMovie, getMovies } from "../services/movieService";
import MoviesTable from "./moviesTable";
import Filter from "./reusables/filterComponent";
import Pagination from "./reusables/paginationComponent";
import SearchBar from "./reusables/searchComponent";
import { paginate } from "./utils/paginate";
// import { useHistory } from "react-router-dom";

class Movies extends Component {
  state = {
    movies: [],
    generes: [],
    pageSize: 4,
    currentPage: 1,
    sortColumn: { path: "title", order: "asc" },
    searchQuery: "",
  };

  async componentDidMount() {
    const { data } = await getGenres();
    const generes = [{ _id: "", name: "All Generes" }, ...data];

    const { data: movies } = await getMovies();
    this.setState({ movies, generes });
  }

  handleDelete = async (movie) => {
    const originalMovies = this.state.movies;

    const movies = originalMovies.filter((m) => m._id !== movie._id);
    this.setState({ movies });

    try {
      await deleteMovie(movie._id);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("This movie has already been deleted");
      }

      this.setState({ movies: originalMovies });
    }
  };

  handleLike = (movie) => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };

  handlePageChange = (page) => {
    //console.log(page);
    this.setState({ currentPage: page });
  };

  handleGenreSelect = (genre) => {
    this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 });
  };

  handleSearch = (query) => {
    // const movies = [...this.state.movies];
    // movies.find((m) => m.title === movie.title);
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleShowToolTip = () => {
    this.setState({ showToolTip: true });
  };
  handleDontShowToolTip = () => {
    this.setState({ showToolTip: false });
  };

  displayData = () => {
    const {
      pageSize,
      currentPage,
      movies,
      selectedGenre,
      searchQuery,
      sortColumn,
    } = this.state;

    let filteredMovies;
    if (searchQuery) {
      filteredMovies = movies.filter((m) =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    } else
      filteredMovies =
        selectedGenre && selectedGenre._id
          ? movies.filter((m) => selectedGenre._id === m.genre._id)
          : movies;

    const sorted = _.orderBy(
      filteredMovies,
      [sortColumn.path],
      [sortColumn.order]
    );

    const currentPageMovies = paginate(sorted, pageSize, currentPage);

    return { totalCount: filteredMovies.length, currentPageMovies };
  };

  render() {
    const { length: noOfMovies } = this.state.movies;
    const { pageSize, currentPage, searchQuery } = this.state;
    //const history = useHistory();
    const { user } = this.props;

    if (noOfMovies === 0) {
      return <p>There are no Movies available.</p>;
    }

    const { totalCount, currentPageMovies } = this.displayData();
    return (
      <div className="row text2-responsive">
        <div className="col col-sm-2">
          <Filter
            items={this.state.generes}
            selectedItem={this.state.selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col my-3">
          {user && user.isAdmin && (
            <Link
              to="/movies/new"
              className="btn btn-primary"
              style={{ marginBottom: 10 }}
            >
              New Movie
            </Link>
          )}

          <h5>There are {totalCount} Movies available.</h5>

          <SearchBar value={searchQuery} onChange={this.handleSearch} />

          <MoviesTable
            movies={currentPageMovies}
            sortColumn={this.state.sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
          <Pagination
            noOfItems={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Movies;
