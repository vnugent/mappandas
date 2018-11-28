import * as React from "react";
import { GeoJSON } from "react-leaflet";

import BaseMap from "./BaseMap";
import * as GeoHelper from "./GeoHelper";
// import { FeatureCollection } from "geojson";

interface IShowPandaProps {
  geojson: any;
}

interface IShowPandaState {}

export default class ShowPanda extends React.Component<
  IShowPandaProps,
  IShowPandaState
> {
  constructor(props: IShowPandaProps) {
    super(props);
  }

  render() {
    const bounds = GeoHelper.bboxFromGeoJson(this.props.geojson);
    console.log("bound", bounds);
    return (
      <BaseMap data={this.props.geojson}>
        <GeoJSON data={this.props.geojson} />
      </BaseMap>
    );
  }
}
