import * as React from "react";
import DeckGL, { MapController } from "deck.gl";
import { StaticMap } from "react-map-gl";
import { FeatureCollection } from "geojson";
import {
  EditableGeoJsonLayer,
  DrawPolygonHandler,
  ModifyHandler
} from "nebula.gl";

import EditToolbar from "./EditToolbar";
import { IPanda } from "./types/CustomMapTypes";
import PandaGL from "./PandaGL";
import MyDrawPointHandler from "./MyDrawPointHandler";

const CUSTOM_MODEHANDLERS = {
  modify: new ModifyHandler(),
  drawPolygon: new DrawPolygonHandler(),
  drawPoint: new MyDrawPointHandler()
};

interface IProps {
  editable: boolean;
  editableJson?: FeatureCollection;
  panda: IPanda;

  viewstate: any;
  onViewStateChanged: (any) => void;
  onEditUpdated: (any, string) => void;
}

interface IState {
  selectedFeatureIndexes: any[];
  mode: string;
}

class MapNG extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedFeatureIndexes: [0],
      mode: "drawPoint"
    };
  }

  INITIAL_VIEWSTATE = {
    width: window.innerWidth,
    height: window.innerHeight,
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
    pitch: 45
  };

  makeEditableLayer = (fc: FeatureCollection) => {
    return new EditableGeoJsonLayer({
      id: "geojson-layer",
      data: fc,
      mode: this.state.mode,
      pickable: true,
      selectedFeatureIndexes: this.state.selectedFeatureIndexes,
      getFillColor: () => [100, 0, 200, 80],
      getRadius: 30,
      getEditHandlePointColor: [200, 10, 0, 200],
      editHandlePointRadiusMaxPixels: 20,
      getEditHandlePointRadius: 30,
      editHandlePointRadiusScale: 1,
      // customize tentative feature style
      getTentativeLineDashArray: () => [7, 4],
      getTentativeLineColor: () => [0x8f, 0x8f, 0x8f, 0xff],
      onEdit: editData => {
        const {
          updatedData,
          editType,
          featureIndex,
          positionIndexes,
          position
        } = editData;
        console.log("editype ", editType, featureIndex, updatedData);
        if (editType === "addFeature") {
          // Add the new feature to the selection
          const updatedSelectedFeatureIndexes = [
            ...this.state.selectedFeatureIndexes,
            featureIndex
          ];
          this.setState(
            { selectedFeatureIndexes: updatedSelectedFeatureIndexes },
            () => this.props.onEditUpdated(updatedData, editType)
          );
        } else if (editType === "movePosition") {
          updatedData.features[featureIndex].geometry.coorindates = position;
          console.log("Moving ", positionIndexes, position);
          this.props.onEditUpdated(updatedData, editType);
        }
      },
      onStartDragging: event => {
        console.log("Start drawing ", event);
      },
      onStopDragging: event => {
        console.log("Stop drawwing ", event);
      },
      modeHandlers: CUSTOM_MODEHANDLERS
    });
  };

  _onLayerClick = info => {
    console.log("onLayerClick", info);
    // if (this.state.mode !== "view") {
    //     return;
    // }
  };

  _onEditModeChange = ({ prevMode, currentMode }) => {
    this.setState({ mode: currentMode });
  };

  componentDidUpdate(prevProps, prevState) {
    console.debug("MapNG.componentDidUpdate() ", prevProps, prevState);
  }

  render() {
    // console.log(CUSTOM_MODEHANDLERS);
    const geojson =
      this.props.editable && this.props.editableJson
        ? this.props.editableJson
        : this.props.panda.geojson;

    const layers = this.props.editable
      ? [this.makeEditableLayer(geojson)]
      : new PandaGL({ data: geojson.features });

    console.log("MapNG layers ", layers);
    return (
      <>
        <EditToolbar onModeChange={this._onEditModeChange} />
        <DeckGL
          initialViewState={this.INITIAL_VIEWSTATE}
          {...this.props.viewstate}
          layers={layers}
          controller={{
            type: MapController,
            dragRotate: false,
            doubleClickZoom: false
          }}
          onViewStateChange={this.props.onViewStateChanged}
          onLayerClick={this._onLayerClick}
        >
          <StaticMap
            reuseMaps
            // mapStyle="mapbox://styles/mapbox/streets-v10"
            viewState={this.props.viewstate}
            preventStyleDiffing={true}
            mapboxApiAccessToken="pk.eyJ1IjoibWFwcGFuZGFzIiwiYSI6ImNqcDdzbW12aTBvOHAzcW82MGg0ZTRrd3MifQ.MYiNJHklgMkRzapAKuTQNg"
          />
        </DeckGL>
      </>
    );
  }
}

export default MapNG;
