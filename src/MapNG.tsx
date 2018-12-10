import * as React from "react";
import DeckGL, { MapController } from "deck.gl";
import { StaticMap } from "react-map-gl";
import { FeatureCollection } from "geojson";
import { EditableGeoJsonLayer } from "nebula.gl";

import EditToolbar from "./EditToolbar";
import PandaGL from "./PandaGL";
import MyDrawPointHandler from "./MyDrawPointHandler";

const CUSTOM_MODEHANDLERS = {
  ...EditableGeoJsonLayer.defaultProps.modeHandlers,
  //deletePoint: new DeleteHandler(),
  drawPoint: new MyDrawPointHandler()
};

const EDIT_MODE_TO_HANDLER_MAP = {
  drawPoint: { nebula_mode: "drawPoint", cursor: "default" },
  move: { nebula_mode: "modify", cursor: "move" },
  deletePoint: { nebula_mode: "view", cursor: "grabbing" }
};

interface IProps {
  editable: boolean;
  geojson: FeatureCollection;

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
      id: "editable-geojson-layer",
      data: fc,
      mode: EDIT_MODE_TO_HANDLER_MAP[this.state.mode].nebula_mode,
      pickable: true,
      autoHighlight: true,
      selectedFeatureIndexes: this.state.selectedFeatureIndexes,
      getFillColor: () => [100, 0, 200, 80],
      getRadius: 30,
      getEditHandlePointColor: [200, 10, 0, 200],
      editHandlePointRadiusMinPixels: 10,
      editHandlePointRadiusMaxPixels: 80,
      getEditHandlePointRadius: 30,
      editHandlePointRadiusScale: 4,
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
      modeHandlers: CUSTOM_MODEHANDLERS,
      editHandleType: "point",
      editHandleIconAtlas: "/icon-atlas.png",
      editHandleIconMapping: {
        marker: {
          x: 0,
          y: 0,
          width: 128,
          height: 128,
          anchorY: 128,
          mask: false
        }
      },
      getSize: 30,
      sizeScale: 10,
      getEditHandleIcon: d => "marker",
      getEditHandleIconSize: 128,
      getEditHandleIconColor: handle =>
        handle.type === "existing"
          ? [0xff, 0x80, 0x00, 0xff]
          : [0x0, 0x0, 0x0, 0x80]
    });
  };
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

  _onEditModeChange = ({ prevMode, currentMode }) => {
    let selected: number[] = [];

    const n = this.props.geojson.features.length;
    selected = [...Array(n).keys()];

    this.setState({
      mode: currentMode,
      selectedFeatureIndexes: selected
    });
  };

  componentDidUpdate(prevProps, prevState) {
    console.debug("MapNG.componentDidUpdate() ", prevProps, prevState);
  }

  render() {
    const { editable, geojson } = this.props;
    const layers = editable
      ? [this.makeEditableLayer(geojson), this.state.mode!=="move" ? new PandaGL({ data: geojson.features }):null]
      : new PandaGL({ data: geojson.features });

    console.log("MapNG layers ", layers);
    return (
      <>
        {editable && (
          <EditToolbar
            mode={this.state.mode}
            onModeChange={this._onEditModeChange}
          />
        )}
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
          getCursor={e => EDIT_MODE_TO_HANDLER_MAP[this.state.mode].cursor}
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
