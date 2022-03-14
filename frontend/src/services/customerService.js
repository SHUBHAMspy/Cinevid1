import { apiUrl } from "../config.json";
import http from "./httpService";

const apiEndpoint = apiUrl + "/customers";

export function addCustomer(customer, userId) {
  // console.log(customerId);
  // console.log(movieId);
  const body = {
    userId,
    name: customer.name,
    phone: customer.phoneNumber,
  };
  if (customer.isGold) {
    body.isGold = customer.isGold;
  }
  //console.log(body);
  return http.post(apiEndpoint, body);
}

export function getCustomers() {
  const customers = http.get(apiEndpoint);
  return customers;
}

export async function checkCustomer(userId) {
  const { data: customers } = await getCustomers();

  const user = customers.find(({ user }) => user._id === userId);
  return user ? true : false;
}

export async function getIndividualCustomer(userId) {
  const { data: customers } = await getCustomers();

  const customer = customers.find((customer) => customer.user._id === userId);

  return customer;
}

export function deleteCustomer(customer) {
  return http.delete(`${apiEndpoint}/${customer._id}`);
}
