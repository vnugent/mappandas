import { createContext } from "react";

const authContext = createContext({
  authenticated: false, // to check if authenticated or not
  user: {
    id: "",
    email: "",
    role: "visitor"
  }, // store all the user details
  accessToken: "", // accessToken of user for Auth0
  initiateLogin: () => {}, // to start the login process
  handleAuthentication: () => {}, // handle Auth0 login process
  renewSession: () => {},
  isAuthenticated: () => {},
  logout: () => {}, // logout the user
  updateUser: metadata => {},
  getUserInfo: () => {}
});

export const AuthProvider = authContext.Provider;
export const AuthConsumer = authContext.Consumer;
