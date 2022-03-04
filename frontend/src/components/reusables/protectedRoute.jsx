import React from "react";
import { Redirect, Route } from "react-router";
import authenticationService from "../../services/authenticationService";

const ProtectedRoute = ({ path, component: Component, render, ...rest }) => {
  return (
    <Route
      path={path}
      {...rest}
      render={(props) => {
        if (!authenticationService.getCurrentUser())
          return (
            <Redirect
              to={{
                pathname: "/loginForm",
                state: { from: props.location },
              }}
            />
          );
        return Component ? <Component {...props} /> : render(props);
      }}
    />
  );
};

export default ProtectedRoute;
