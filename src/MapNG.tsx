import * as React from "react";
import DeckGL, { MapController, GeoJsonLayer, IconLayer } from "deck.gl";
import { StaticMap } from "react-map-gl";
import MAP_STYLE from "./MapStyles/street-v10";

import { IPanda } from "./types/CustomMapTypes";
//import * as GeoHelper from "./GeoHelper";

interface IProps {
  panda: IPanda;
  viewstate: any;
  onViewStateChanged: (any) => void;
}

interface IState {
  //   viewport: any;
  //   geojson: any;
}

class MapNG extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    // this.state = {
    //   viewport: { ...this.INITIAL_VIEWSTATE },
    //   geojson: {}
    // };
  }

  componentDidMount() {
    //    this.setState({ geojson: this.props.panda.geojson });
  }

  INITIAL_VIEWSTATE = {
    width: window.innerWidth,
    height: window.innerHeight,
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
    pitch: 45
  };

  ICON_MAPPING = {
    marker: { x: -122.472324, y: 37.806802, width: 32, height: 32, mask: true }
  };

  ICONS = [{ name: "foo", coordinates: [-122.472324, 37.806802] }];
  GEOJSON = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: { type: "Point", coordinates: [-122.472324, 37.806802] }
      }
    ]
  };

  GEOJSON2 = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-122.467475, 37.804834],
              [-122.466531, 37.804834],
              [-122.466424, 37.804173],
              [-122.467453, 37.803987],
              [-122.467475, 37.804834]
            ]
          ]
        }
      },
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: [-122.46648788452148, 37.7933719729637]
        }
      }
    ]
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
      getFillColor: [255, 128, 10],
      // getLineColor: d => colorToRGBArray(d.properties.color),
      lightSettings: this.LIGHT_SETTINGS,
      getRadius: 400,
      getLineWidth: 2,
      getElevation: 10
    });
  };

  iconLayer = new IconLayer({
    id: "icon-layer",
    data: this.ICONS,
    pickable: true,
    iconAtlas: "./icon-atlas.png",
    iconMapping: {
      marker: {
        x: 0,
        y: 0,
        width: 128,
        height: 128,
        anchorY: 128,
        mask: true
      }
    },
    sizeScale: 10,
    getPosition: d => d.coordinates,
    getIcon: d => "marker",
    getSize: 10,
    getColor: d => [255, 128, 0],
    onHover: ({ object, x, y }) => {
      // const tooltip = `${object.name}\n${object.address}`;
    }
  });

  componentDidUpdate(prevProps, prevState) {
    console.debug("MapNG.componentDidUpdate() ", prevProps, prevState);
  }

  render() {
    // if (!this.state.geojson) {
    //   null;
    // }
    console.debug(MAP_STYLE);
    // const layers = [
    //   new LineLayer({ id: "line-layer", data: this.data }),
    //   this.layer,
    //   this.iconLayer
    // ];
    const { geojson, bbox } = this.props.panda;
    console.log(">> deckGL.render() ", geojson, bbox, this.props.viewstate);
    const layers = [this.makeGeoJSONLayer(geojson)];
    // const viewstate =
    //   geojson.features.length > 0
        // ? Object.assign(this.props.viewstate, GeoHelper.bounds2Viewport(bbox))
        // : this.props.viewstate;
    return (
      <DeckGL
        initialViewState={this.INITIAL_VIEWSTATE}
        {...this.props.viewstate}
        {...(geojson ? { layers: layers } : null)}
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
