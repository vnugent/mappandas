import * as React from "react";
import {
  Route,
  Switch,
} from "react-router-dom";

import ShowPandaURLHandler from "./ShowPandaURLHandler";

export interface IAppProps {
}

export interface IAppState { }

class Main extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    console.log("#CDM() ", this.props);

    // if (localStorage.getItem("isLoggedIn") === "true") {
    //   renewSession();
    // }
    //@ts-ignore
    //if (!this.props.authenticated) this.props.checkSession();
  }

  public render() {
    return (<Switch>
      <Route path="/new" render={(props) => <ShowPandaURLHandler editNew={true} {...props} />} />
      <Route path="/p/:uuid?/:edit?" render={(props) => <ShowPandaURLHandler editNew={false} {...props} />} />
    </Switch>);
  }
}

export default Main;