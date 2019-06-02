import * as React from "react";
import auth0 from "auth0-js";

import { AUTH_CONFIG } from "./auth0-variables";
import { AuthProvider } from "./authContext";
import AuthUser from "./types/AuthUser";

const auth = new auth0.WebAuth({
  domain: AUTH_CONFIG.domain,
  clientID: AUTH_CONFIG.clientId,
  redirectUri: AUTH_CONFIG.callbackUrl,
  audience: `https://${AUTH_CONFIG.domain}/api/v2/`,
  responseType: "token id_token",
  scope: "read:current_user update:current_user_metadata openid profile email"
});

export const DEFAULT_AUTHUSER = (): AuthUser => ({
  id: "",
  email: "",
  role: "visitor"
});

interface IProps {}
interface IState {
  authenticated: boolean;
  user: AuthUser;
  accessToken: string;
  expiresAt: number;
}

class Auth extends React.Component<IProps, IState> {
  private authMgmt: any;
  constructor(props: IProps) {
    super(props);

    this.state = {
      authenticated: false,
      user: DEFAULT_AUTHUSER(),
      accessToken: "",
      expiresAt: Date.now()
    };
  }

  initiateLogin = () => {
    auth.authorize();
  };

  logout = () => {
    localStorage.setItem("isLoggedIn", "false");
    this.setState(
      {
        authenticated: false,
        user: DEFAULT_AUTHUSER(),
        accessToken: ""
      },
      () => console.log("#logout")
    );
  };

  handleAuthentication = () => {
    auth.parseHash((error, authResult) => {
      if (error) {
        console.log(error);
        console.log(`Error ${error.error} occured`);
        return;
      }

      this.setSession(authResult);
    });
  };

  setSession = authResult => {
    console.log("#Auth0 session data ", authResult);
    localStorage.setItem("isLoggedIn", "true");
    const data = authResult.idTokenPayload;
    const user = {
      id: plainUserId(data.sub),
      email: data.email,
      name: data.name,
      role: data[AUTH_CONFIG.roleUrl],
      ...this.getProfileInfo(data)
    };

    this.authMgmt = new auth0.Management({
      domain: AUTH_CONFIG.domain,
      token: authResult.accessToken
    });

    this.setState({
      authenticated: true,
      accessToken: data.accessToken,
      user,
      expiresAt: authResult.expiresIn * 1000 + new Date().getTime()
    });
  };

  renewSession() {
    auth.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        this.logout();
        console.log(err);
        alert(
          `Could not get a new token (${err.error}: ${err.error_description}).`
        );
      }
    });
  }

  getUserInfo = () => {
    const { user } = this.state;

    // this.authMgmt.getUser(user.id, function(error, user) {
    //   if (error) {
    //     console.log(error);
    //     console.log(`Error ${error.error} occured`);
    //     return;
    //   }
    //   console.log("#getUserInfo() ", user);
    // });

    this.authMgmt.getUser(user.id, function(err, user) {
      console.log("#getUserInfo() ", user);
    });
  };

  updateUser = ({ newUser }) => {
    const { user } = this.state;

    this.authMgmt.patchUserMetadata(
      user.id,
      newUser.userMetadata,
      (error, result) => {
        if (error) {
          console.log(error);
          console.log(`Error ${error.error} occured`);
          return;
        }
        Object.assign(user, newUser.user_metadata);
        this.setState({ user });
        console.log("#update user ", result);
        //this.setSession(result.idTokenPayload);
      }
    );
  };

  render() {
    const authProviderValue = {
      ...this.state,
      initiateLogin: this.initiateLogin,
      handleAuthentication: this.handleAuthentication,
      renewSession: this.renewSession,
      isAuthenticated: this.isAuthenticated,
      logout: this.logout,
      updateUser: this.updateUser,
      getUserInfo: this.getUserInfo
    };
    return (
      <AuthProvider value={authProviderValue}>
        {this.props.children}
      </AuthProvider>
    );
  }

  getProfileInfo = payload => {
    return {
      name2: payload["https://mappandas-app/name"],
      about: payload["https://mappandas-app/about"]
    };
  };

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    console.log("#isAuthenticated? ", this.state);
    if (!this.state) return false;
    return new Date().getTime() < this.state.expiresAt;
  }
}

/**
 * split Auth0 email|id to just id
 * @param auth0id auth0 id
 */
const plainUserId = auth0id => {
  if (auth0id) {
    const ss = auth0id.split("|");
    return ss.length === 2 ? ss[1] : null;
  }
  return null;
};

export default Auth;
