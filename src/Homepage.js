import React from "react";
import { Redirect } from "react-router-dom";

import { AuthConsumer } from "./authContext";
import { Login, Logout } from "./Login";

const HomePage = () => (
  <AuthConsumer>
    {({ authenticated }) =>
      authenticated ? (
        <Redirect to="/dashboard" />
      ) : (
        // <Redirect to="/u/2019" />
        <div>
          <h2>Welcome to React RBAC Tutorial.</h2>

          <Login />

          <Logout />
        </div>
      )
    }
  </AuthConsumer>
);

export default HomePage;
