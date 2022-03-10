import { apiUrl } from "../config.json";
import http from "./httpService";

const apiEndpoint = apiUrl + "/returns";

export function returnMovie(customerId, movieId) {
  const body = {
    customerId,
    movieId,
  };
  return http.post(apiEndpoint, body);
}
