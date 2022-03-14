import jwt_decode from "jwt-decode";
import { apiUrl } from "../config.json";
import http from "./httpService";

const apiEndpoint = apiUrl + "/auth";
const tokenKey = "token";

http.setJWT(getJWT());

export async function login(email, password) {
  const { data: jwt } = await http.post(apiEndpoint, { email, password });
  localStorage.setItem(tokenKey, jwt);
}

export function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

export function logout() {
  localStorage.removeItem(tokenKey);
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    const user = jwt_decode(jwt);
    //console.log(user);
    return user;
  } catch (error) {
    return null;
  }
}

export function getJWT() {
  return localStorage.getItem(tokenKey);
}

export default {
  login,
  loginWithJwt,
  logout,
  getCurrentUser,
  getJWT,
};
