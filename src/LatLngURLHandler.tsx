import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import * as GeoHelper from "./GeoHelper";

interface IProps extends RouteComponentProps {
  onLatLngChanged: Function;
}

export default class LatLngURLHandler extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
  }

  parseParams = () => {
    const params = this.props.match.params;
    if (params["lat"] && params["lng"]) {
      const zoom = params["zoom"] ? params["zoom"] : 12;
      if (isNaN(params["lat"]) || isNaN(params["lng"])) {
          return GeoHelper.INITIAL_VIEWSTATE;
      }

      return {
        ...GeoHelper.INITIAL_VIEWSTATE,
        latitude: Number(params["lat"]),
        longitude: Number(params["lng"]),
        zoom: zoom
      };
    }

    return GeoHelper.INITIAL_VIEWSTATE;
  };

  componentDidMount() {
    const vp = this.parseParams();
    this.props.onLatLngChanged(vp);
  }

  render() {
    return null;
  }
}
