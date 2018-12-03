import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import { IViewport } from "./types/CustomMapTypes";
import { LatLng } from "leaflet";
import { DEFAULT_VIEWPORT } from "./DefaultURLHandler";

interface IProps extends RouteComponentProps {
  onLatLngChanged: Function;
}

interface IState {
  viewport?: IViewport;
  onViewportChanged: Function;
}

export default class LatLngURLHandler extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  parseParams = (): IViewport => {
    const params = this.props.match.params;
    if (params["lat"] && params["lng"]) {
      const zoom = params["zoom"] ? params["zoom"] : 12;
      return { center: new LatLng(params["lat"], params["lng"]), zoom: zoom };
    }
    return DEFAULT_VIEWPORT;
  };

  componentDidMount() {
    const vp = this.parseParams();
    this.props.onLatLngChanged(vp);
  }

  render() {
    return null;
  }
}
