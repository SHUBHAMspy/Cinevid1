import Joi from "joi";
import React from "react";
import { withRouter } from "react-router";
import authenticationService from "../services/authenticationService";
import {
  checkCustomer,
  getIndividualCustomer,
} from "../services/customerService";
import { getGenres } from "../services/genreService";
import { getMovie, saveMovie } from "../services/movieService";
import { rentMovie } from "../services/rentalService";
import Form from "./reusables/formComponent";

class MovieForm extends Form {
  state = {
    data: {
      title: "",
      genreId: "",
      numberInStock: "",
      dailyRentalRate: "",
    },
    genres: [],
    errors: {},
  };

  schema = {
    _id: Joi.string(),
    title: Joi.string().label("Movie Name"),
    genreId: Joi.string().required().label("Genre"),
    numberInStock: Joi.number().min(0).max(100).label("Number In Stock"),
    dailyRentalRate: Joi.number().min(1).max(10).label("Daily Rental Rate"),
  };

  async populateGenres() {
    const { data: genres } = await getGenres();
    this.setState({ genres });
  }

  async populateMovie() {
    try {
      //console.log(this.props);
      const movieId = this.props.match.params.id;
      if (movieId === "new") {
        return;
      }

      const { data: movie } = await getMovie(movieId);
      this.setState({ data: this.mapToViewModel(movie) });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        this.props.history.replace("/not-found");
      }
    }
  }

  async componentDidMount() {
    await this.populateGenres();

    // Now we have to decide what kind of View we want to render
    // Because here no event is occurring except save event which is handled by another Component
    // So that we can call an event for setting the state or some other function once according to the use case.
    // And also we want a specific view to be rendered when the component has been loaded or rendered
    //that means when the component is rendered, based on a specific conditiion we want to have a view or display a view
    // and that we will be better if done(i.e the deciding work) on the first load or render of the component

    await this.populateMovie();
  }

  mapToViewModel(movie) {
    return {
      _id: movie._id,
      title: movie.title,
      genreId: movie.genre._id,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate,
    };
  }

  formSchema = Joi.object(this.schema);

  save = false;
  movieform = true;

  submitIt = async () => {
    // Calling the server for data

    await saveMovie(this.state.data);
    console.log("Form Submitted");
    this.props.history.push("/movies");
  };

  rentIt = async () => {
    // Calling the server for data
    const { _id: userId } = authenticationService.getCurrentUser();
    const movieId = this.props.match.params.id;

    //console.log(await checkCustomer(userId));
    if (await checkCustomer(userId)) {
      const customer = await getIndividualCustomer(userId);
      //console.log(customer);
      await rentMovie(customer._id, movieId);
      console.log("Form Submitted");
      this.props.history.push({
        pathname: "/rentals",
        state: customer,
      });
      return;
    }

    this.props.history.push({
      pathname: "/customerform",
      state: {
        movieId,
        userId,
      },
    });

    // await rentMovie(customer.data._id, movieId);
    // console.log("Form Submitted");
    // this.props.history.push("/rentals");
    // return (
    //   <Redirect
    //     to={{
    //       pathname: "/customerform",
    //       state: { movieId: movieId },
    //     }}
    //   />
    // );
  };

  render() {
    const user = authenticationService.getCurrentUser();
    return (
      <div>
        <h2>Movie Form</h2>
        <form onSubmit={this.handleFormSubmit}>
          {this.renderInput("title", "Movie Name")}
          {this.renderDropdown(
            "genreId",
            "Genre",
            this.state.genres,
            this.movieform
          )}
          {this.renderInput("numberInStock", "Stock")}
          {this.renderInput("dailyRentalRate", "Rate")}
          {!user.isAdmin && this.renderButton("Rent It")}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
            }}
          >
            {user.isAdmin && this.renderButton("Save")}
            {user.isAdmin && this.renderButton("Rent It")}
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(MovieForm);

// const MovieForm = () => {
//   const movieId = useParams().id;
//   const history = useHistory();
//   return (
//     <div>
//       <h1>MovieForm {movieId}</h1>
//       <button
//         className="btn btn-primary"
//         onClick={() => history.push("/movies")}
//       >
//         Save
//       </button>
//     </div>
//   );
// };
