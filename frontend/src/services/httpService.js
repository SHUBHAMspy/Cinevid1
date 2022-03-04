import axios from "axios";

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    console.log("Logging the error", error);
  }

  return Promise.reject(error);
});

export const setJWT = (jwt) => {
  axios.defaults.headers.common["auth-token"] = jwt;
};

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJWT,
};
