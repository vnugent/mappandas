import React from "react";
import { Redirect, withRouter } from "react-router-dom";

import { AuthConsumer } from "./authContext";
import { Login, Logout } from "./Login";
import withAuth from "./withAuth";

const HomePage = ({ auth }) => {
  console.log("#HomePage ", auth);
  return auth.isAuthenticated() ? (
    <Redirect to="/dashboard" />
  ) : (
    // <Redirect to="/u/2019" />
    <div>
      <h2>Welcome to React RBAC Tutorial.</h2>

      <Login />

      <Logout />
    </div>
  );
};

export default withRouter(withAuth(HomePage));
