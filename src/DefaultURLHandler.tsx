import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import * as GeoHelper from "./GeoHelper";

interface IProps extends RouteComponentProps {
  onInitialized: Function;
}

interface IState {}

export default class DefaultUrLHandler extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  componentDidMount() {
    const state = this.props.location.state;
    if (state && state.dontMoveMap) {
      // reset the state flag
      this.props.history.replace({
        pathname: this.props.location.pathname,
        state: {}
      });
      return;
    }
    this.props.onInitialized(GeoHelper.INITIAL_VIEWSTATE());
  }

  render() {
    return null;
  }
}
