import * as React from "react";
import DeckGL, { MapController, GeoJsonLayer } from "deck.gl";
import { StaticMap } from "react-map-gl";
import { Hidden, withWidth } from "@material-ui/core";


//import Geocoder from "@mappandas/react-map-gl-geocoder";
import Geocoder from "react-map-gl-geocoder";

import * as _ from "underscore";

import * as Config from "./Config";
import PandaGL from "./PandaGL";
import { IActiveFeature } from "./types/CustomMapTypes";
import { FeatureCollection } from "geojson";

interface IProps {
  geojson: FeatureCollection;
  mapStyle: string;
  viewstate: any;
  onViewStateChanged: (any) => void;
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
    const layers =
      geojson.features && geojson.features.length > 0
        ? new PandaGL({ data: geojson.features })
        : [];
    if (this.state.searchResultLayer) {
      //layers.push(this.state.searchResultLayer);
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
        <ResponsiveGeocoder
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

const ResponsiveGeocoder = withWidth()((props: any) => (
  <Hidden mdDown>
    <Geocoder {...props} />
  </Hidden>
));

export default MapNG;
