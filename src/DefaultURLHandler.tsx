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
    GeoHelper.getLatLngFromIP().then(data => {
      if (data) this.props.onInitialized(data);
    });
  }

  render() {
    return null;
  }
}
