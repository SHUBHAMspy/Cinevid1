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

export function getRentals() {
  return http.get(apiEndpoint);
}

export async function getCustomerRentals(customer) {
  const customerId = customer._id;
  const { data: rentals } = await getRentals();
  console.log(rentals);
  const customerRentals = rentals.filter(
    ({ customer }) => customer._id === customerId
  );
  return customerRentals;
}

export function deleteRental(rental) {
  return http.delete(`${apiEndpoint}/${rental._id}`);
}
