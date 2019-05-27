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
import Callback from "./Callback";
import Profile from "./Profile";

export interface IAppProps extends RouteComponentProps {}

export interface IAppState {}

class Main extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return (
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/profile" component={Profile} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/u/:userid" component={Dashboard} />
        <Route path="/p/:uuid?/:edit?" component={PandaEditor} />
        <Route path="/callback" component={Callback} />
      </Switch>
    );
  }
}

export default withRouter(Main);
