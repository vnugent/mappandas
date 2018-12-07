import * as React from "react";
import DeckGL, { MapController, GeoJsonLayer } from "deck.gl";
import { StaticMap } from "react-map-gl";

import { IPanda } from "./types/CustomMapTypes";
import PandaGL from "./PandaGL";

interface IProps {
  panda: IPanda;
  viewstate: any;
  onViewStateChanged: (any) => void;
}

interface IState {}

class MapNG extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  INITIAL_VIEWSTATE = {
    width: window.innerWidth,
    height: window.innerHeight,
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
    pitch: 45
  };

  LIGHT_SETTINGS = {
    lightsPosition: [-125, 50.5, 5000, -122.8, 48.5, 8000],
    ambientRatio: 0.2,
    diffuseRatio: 0.5,
    specularRatio: 0.3,
    lightsStrength: [2.0, 0.0, 1.0, 0.0],
    numberOfLights: 2
  };

  layer = new GeoJsonLayer({
    id: "geojson-layer",
    data: null,
    pickable: true,
    stroked: false,
    filled: true,
    wireframe: true,
    extruded: true,
    lineWidthScale: 20,
    lineWidthMinPixels: 2,
    getFillColor: [160, 160, 180, 200],
    // getLineColor: d => colorToRGBArray(d.properties.color),
    lightSettings: this.LIGHT_SETTINGS,
    getRadius: 40,
    getLineWidth: 1,
    getElevation: 10
  });

  makeGeoJSONLayer = geojson => {
    return new GeoJsonLayer({
      id: "geojson-layer",
      data: geojson,
      pickable: true,
      stroked: false,
      filled: true,
      wireframe: true,
      extruded: true,
      lineWidthScale: 20,
      lineWidthMinPixels: 2,
      getFillColor: [255, 128, 0],
      // getLineColor: d => colorToRGBArray(d.properties.color),
      lightSettings: this.LIGHT_SETTINGS,
      getRadius: 400,
      getLineWidth: 2,
      getElevation: 10
    });
  };

  componentDidUpdate(prevProps, prevState) {
    console.debug("MapNG.componentDidUpdate() ", prevProps, prevState);
  }

  render() {
    const { geojson } = this.props.panda;
    //const layers = [this.makeGeoJSONLayer(geojson)];
    const pandaLayer = new PandaGL({ data: geojson.features });
    console.log("PandaGL ", pandaLayer);
    return (
      <DeckGL
        initialViewState={this.INITIAL_VIEWSTATE}
        {...this.props.viewstate}
        // {...(geojson ? { layers: layers } : null)}
        layers={pandaLayer}
        controller={{ type: MapController, dragRotate: false }}
        onViewStateChange={this.props.onViewStateChanged}
      >
        <StaticMap
          reuseMaps
          // mapStyle="mapbox://styles/mapbox/streets-v10"
          viewState={this.props.viewstate}
          preventStyleDiffing={true}
          mapboxApiAccessToken="pk.eyJ1IjoibWFwcGFuZGFzIiwiYSI6ImNqcDdzbW12aTBvOHAzcW82MGg0ZTRrd3MifQ.MYiNJHklgMkRzapAKuTQNg"
        />
      </DeckGL>
    );
  }
}

export default MapNG;
