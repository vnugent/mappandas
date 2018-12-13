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
    console.log("### DefaultURLHandler ###", props.match);
  }

  componentDidMount() {
    const state = this.props.location.state;
    if (state && state.dontMoveMap) {
      console.log("Don't move map");
      // reset the state flag
      this.props.history.replace({
        pathname: this.props.location.pathname,
        state: {}
      });
      return;
    }
    GeoHelper.getLatLngFromIP().then(data => {
      if (data) {
        this.props.onInitialized({
          ...GeoHelper.INITIAL_VIEWSTATE,
          latitude: data[0],
          longitude: data[1]
        });
      } else {
        this.props.onInitialized(GeoHelper.INITIAL_VIEWSTATE);
      }
    });
  }

  render() {
    return null;
  }
}
