import * as React from "react";
import DeckGL, { MapController, GeoJsonLayer } from "deck.gl";
import { StaticMap } from "react-map-gl";

import { FeatureCollection2 } from "@mappandas/yelapa";

import Geocoder from "@mappandas/react-map-gl-geocoder";

import * as _ from "underscore";

import * as Config from "./Config";
import PandaGL from "./PandaGL";
import { IActiveFeature } from "./types/CustomMapTypes";

interface IProps {
  geojson: FeatureCollection2;
  mapStyle: string;
  viewstate: any;
  onViewStateChanged: (any) => void;
  onEditUpdated: (any, string) => void;
  onHover?: (data: IActiveFeature | null) => void;
}

interface IState {
  selectedFeatureIndexes: any[];
  mode: string;
  searchResultLayer: GeoJsonLayer;
}

class MapNG extends React.Component<IProps, IState> {
  private mapRef = React.createRef<StaticMap>();

  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedFeatureIndexes: [0],
      mode: "drawPoint",
      searchResultLayer: null
    };
  }

  _onLayerClick = info => {
    console.log("onLayerClick", info);
    if (info && this.state.mode === "deletePoint" && this.props.geojson) {
      const features = [...this.props.geojson.features];
      features.splice(info.index, 1);
      const data = { ...this.props.geojson, features };
      this.setState({ selectedFeatureIndexes: [] }, () =>
        this.props.onEditUpdated(data, "removePoint")
      );
    }
  };

  handleOnResult = event => {
    this.setState({
      searchResultLayer: new GeoJsonLayer({
        id: "search-result",
        data: event.result.geometry,
        getFillColor: [255, 0, 0, 128],
        getRadius: 1000,
        pointRadiusMinPixels: 10,
        pointRadiusMaxPixels: 10
      })
    });
  };

  _onHover = (evt: any) => {
    if (this.props.onHover) {
      if (!evt) {
        this.props.onHover(null);
      } else {
        const { x, y, index, object } = evt;
        this.props.onHover({ x, y, index, object });
      }
    }
  };

  render() {
    const { geojson, mapStyle } = this.props;
    const layers = [new PandaGL({ data: geojson.features })];

    if (this.state.searchResultLayer) {
      layers.push(this.state.searchResultLayer);
    }

    return (
        <DeckGL
          initialViewState={this.props.viewstate}
          {...this.props.viewstate}
          layers={layers}
          controller={{
            type: MapController,
            dragRotate: false,
            doubleClickZoom: true
          }}
          onViewStateChange={this.props.onViewStateChanged}
          onLayerHover={this._onHover}
        >
          <Geocoder
            className="geocoder-container"
            mapRef={this.mapRef}
            onResult={this.handleOnResult}
            onViewportChange={this.props.onViewStateChanged}
            mapboxApiAccessToken={Config.MAPBOX_TOKEN}
            position="top-left"
            divId="search-container"
            flyTo={false}
          />
          <StaticMap
            reuseMaps
            mapStyle={`mapbox://styles/mapbox/${mapStyle}`}
            viewState={this.props.viewstate}
            preventStyleDiffing={true}
            mapboxApiAccessToken={Config.MAPBOX_TOKEN}
            ref={this.mapRef}
          />
        </DeckGL>
    );
  }
}

export default MapNG;
