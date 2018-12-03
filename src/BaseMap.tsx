import * as React from "react";
import { Map, TileLayer, LayersControl } from "react-leaflet";

import { IViewport } from "./types/CustomMapTypes";
import { LatLngBounds } from "leaflet";

interface IMapStateType {}

interface IMapPropsType {
  viewport?: IViewport;
  bbox?: LatLngBounds;
  onViewportChanged: Function;
}

const mapboxAttribution =
  'Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
  'Imagery © <a href="http://mapbox.com">Mapbox</a>';

const mapboxUrl =
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwcGFuZGFzIiwiYSI6ImNqcDdzbW12aTBvOHAzcW82MGg0ZTRrd3MifQ.MYiNJHklgMkRzapAKuTQNg";

export default class BaseMap extends React.Component<
  IMapPropsType,
  IMapStateType
> {
  constructor(props: IMapPropsType) {
    super(props);
  }

  render() {
    console.log(
      ">> BaseMap bounds, viewport ",
      this.props.bbox,
      this.props.viewport
    );
    return (
      <Map
        onViewportChanged={this.props.onViewportChanged}
        annimated={true}
        {...(this.props.bbox
          ? { bounds: this.props.bbox }
          : { viewport: this.props.viewport })}
        boundsOptions={{ padding: [100, 100] }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer name="Street" checked>
            <TileLayer
              attribution={mapboxAttribution}
              url={mapboxUrl}
              id="mapbox.streets"
              maxZoom={25}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution={mapboxAttribution}
              url={mapboxUrl}
              id="mapbox.satellite"
              maxZoom={25}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Outdoors">
            <TileLayer
              attribution={mapboxAttribution}
              url={mapboxUrl}
              id="mapbox.outdoors"
              maxZoom={25}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Night">
            <TileLayer
              attribution={mapboxAttribution}
              url={mapboxUrl}
              id="mapbox.dark"
              maxZoom={25}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Light">
            <TileLayer
              attribution={mapboxAttribution}
              url={mapboxUrl}
              id="mapbox.light"
              maxZoom={25}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="OSM">
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        {this.props.children}
      </Map>
    );
  }
}
