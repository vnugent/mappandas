import React from "react";

import { AuthConsumer } from "./authContext";

export const Login = () => (
  <AuthConsumer>
    {({ initiateLogin }) => (
      <button className="btn btn-sm btn-primary" onClick={initiateLogin}>
        Login
      </button>
    )}
  </AuthConsumer>
);

export const Logout = () => (
  <AuthConsumer>
    {({ logout }) => (
      <button className="btn btn-sm btn-primary" onClick={logout}>
        Logout
      </button>
    )}
  </AuthConsumer>
);
