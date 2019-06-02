import * as React from "react";
import {
  Route,
  Switch,
  withRouter,
  RouteComponentProps
} from "react-router-dom";

import Dashboard from "./dashboard/Dashboard";
import PandaEditor from "./PandaEditor";
import HomePage from "./Homepage";
import { Login } from "./Login";
import Callback from "./Callback";
import Profile from "./dashboard/Profile";
import { AuthConsumer } from "./authContext";
import Can from "./Can";
import withAuth from "./withAuth";

export interface IAppProps extends RouteComponentProps {
  auth: any;
}

export interface IAppState {}

class Main extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    console.log("#CDM() ", this.props);
    const { renewSession } = this.props.auth;

    // if (localStorage.getItem("isLoggedIn") === "true") {
    //   renewSession();
    // }
    //@ts-ignore
    //if (!this.props.authenticated) this.props.checkSession();
  }
  public render() {
    const { user, isAuthenticated } = this.props.auth;
    return (
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/profile" component={Profile} />
        <Route
          path="/dashboard"
          render={props => (
            <Can
              {...props}
              role={user.role}
              perform="dashboard:modify"
              yes={() => <Dashboard />}
              no={() => <HomePage />}
            />
          )}
        />
        <Route path="/u/:userid" component={Dashboard} />
        <Route path="/p/:uuid?/:edit?" component={PandaEditor} />
        <Route path="/callback" component={Callback} />
      </Switch>
    );
  }
}

export default withRouter(withAuth(Main));
