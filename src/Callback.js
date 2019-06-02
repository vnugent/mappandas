import React from "react";
import { Redirect } from "react-router-dom";

import withAuth from "./withAuth";

const Callback = props => {
  console.log("#callback ", props);
  if (/access_token|id_token|error/.test(props.location.hash)) {
    props.auth.handleAuthentication();
  }
  return <Redirect to="/" />;
};

export default withAuth(Callback);
