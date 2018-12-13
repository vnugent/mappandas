import * as React from "react";
import DeckGL, {
  LineLayer,
  MapController,
  GeoJsonLayer,
  IconLayer,
  TextLayer
} from "deck.gl";
import { StaticMap } from "react-map-gl";
import MAP_STYLE from "./MapStyles/street-v10";

interface IProps {}

interface IState {}
class BaseMapGL extends React.Component<IProps, IState> {
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
  INITIAL_VIEWSTATE = {
    width: 800,
    height: 600,
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
    pitch: 45
  };
  state = {
    viewport: { ...this.INITIAL_VIEWSTATE }
  };

  LIGHT_SETTINGS = {
    lightsPosition: [-125, 50.5, 5000, -122.8, 48.5, 8000],
    ambientRatio: 0.2,
    diffuseRatio: 0.5,
    specularRatio: 0.3,
    lightsStrength: [2.0, 0.0, 1.0, 0.0],
    numberOfLights: 2
  };

  private data = [
    {
      sourcePosition: [-122.41669, 37.7853],
      targetPosition: [-122.41669, 37.781]
    }
  ];

  layer = new GeoJsonLayer({
    id: "geojson-layer",
    data: this.GEOJSON2,
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

  textLayer = new TextLayer({
    id: "twitter-topics-raw",
    data: this.ICONS,
    getText: d => d.name,
    getPosition: x => x.coordinates,
    getColor: d => [29, 145, 192],
    getSize: d => 20,
    sizeScale: 1.5
  });

  render() {
    console.debug(MAP_STYLE);
    const layers = [
      new LineLayer({ id: "line-layer", data: this.data }),
      this.layer,
      this.iconLayer
    ];
    return (
      <DeckGL
        initialViewState={this.INITIAL_VIEWSTATE}
        {...this.state.viewport}
        layers={layers}
        controller={{ type: MapController, dragRotate: false }}
        onViewStateChange={viewport => this.setState({ viewport: viewport })}
      >
        <StaticMap
          reuseMaps
          // mapStyle="mapbox://styles/mapbox/streets-v10"
          viewState={this.state.viewport}
          preventStyleDiffing={true}
          mapboxApiAccessToken="pk.eyJ1IjoibWFwcGFuZGFzIiwiYSI6ImNqcDdzbW12aTBvOHAzcW82MGg0ZTRrd3MifQ.MYiNJHklgMkRzapAKuTQNg"
        />
      </DeckGL>
    );
  }
}

export default BaseMapGL;
