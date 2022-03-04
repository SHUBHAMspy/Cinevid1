import { apiUrl } from "../config.json";
import http from "./httpService";

const apiEndpoint = apiUrl + "/rentals";

export function rentMovie(customerId, movieId) {
  // console.log(customerId);
  // console.log(movieId);
  const body = {
    customerId,
    movieId,
  };
  console.log(body);
  return http.post(apiEndpoint, body);
}
