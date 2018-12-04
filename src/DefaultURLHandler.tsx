import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import * as GeoHelper from "./GeoHelper";
import { LatLng } from 'leaflet';

interface IProps extends RouteComponentProps {
  onInitialized: Function;
}

interface IState {}

export const DEFAULT_VIEWPORT = {center: new LatLng(40.730610, -73.935242), zoom: 12};

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
          this.props.onInitialized( { center: data, zoom: 12});
      } else {
          this.props.onInitialized(DEFAULT_VIEWPORT);
      } 

    });
  }

  render() {
    return null;
  }
}
