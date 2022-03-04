import { apiUrl } from "../config.json";
import http from "./httpService";

const apiEndpoint = apiUrl + "/customers";

export function addCustomer(customer) {
  // console.log(customerId);
  // console.log(movieId);
  const body = {
    name: customer.name,
    phone: customer.phoneNumber,
  };
  if (customer.isGold) {
    body.isGold = customer.isGold;
  }
  console.log(body);
  return http.post(apiEndpoint, body);
}
