import { apiUrl } from "../config.json";
import authenticationService from "./authenticationService";
import http from "./httpService";

const apiEndpoint = apiUrl + "/users";

export function register(user) {
  return http.post(apiEndpoint, {
    email: user.userEmail,
    password: user.userPassword,
    name: user.userName,
  });
}

export function getUserProfile(user) {
  return http.get(`${apiEndpoint}/me`, user);
}
export function updateUser(user) {
  const { _id: userId } = authenticationService.getCurrentUser();
  //console.log(user);
  const data = {
    name: user.userName,
    email: user.userEmail,
  };

  if (user.confirmUserPassword) data.password = user.confirmUserPassword;
  //console.log(data);
  return http.put(`${apiEndpoint}/${userId}`, data);
}
