import * as React from "react";
import { AuthConsumer } from "./authContext";

const withAuth = Component => {
  return props => {
    return (
      <AuthConsumer>
        {authProps => {
          return <Component {...props} auth={authProps} />;
        }}
      </AuthConsumer>
    );
  };
};

export default withAuth;
