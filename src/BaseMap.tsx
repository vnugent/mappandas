import * as React from "react";
import { Map, TileLayer } from "react-leaflet";
import { FeatureCollection } from "geojson";

import * as GeoHelper from "./GeoHelper";

interface IMapStateType {}

interface IMapPropsType {
  data: FeatureCollection;
}

export default class BaseMap extends React.Component<
  IMapPropsType,
  IMapStateType
> {
  constructor(props: IMapPropsType) {
    super(props);
    // this.state = {
    //   ...MyMap.parseParams(props.match.params)
    // };
  }

  static parseParams = (params: any): IMapStateType => {
    const lat = params["lat"] ? params["lat"] : 45.5428; // need to get default Lat
    const lng = params["lng"] ? params["lng"] : -122.6544;
    const zoom = params["zoom"] ? params["zoom"] : 12;
    return { lat, lng, zoom };
  };

  render() {
    // const bbox = bbox(this.state.geojson)};
    // bounds={this.props.bbox}
    // center={[45.5428, -122.6544]} zoom={12}
    const bounds = GeoHelper.bboxFromGeoJson(this.props.data);
    return (
      <Map
        annimated={true}
        bounds={bounds}
        boundsOptions={{ padding: [100, 100] }}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {this.props.children}
      </Map>
    );
  }
}
