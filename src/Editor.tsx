import * as React from "react";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

interface IEditorProps {
  onChange: Function;
}

export default class Editor extends React.Component<IEditorProps, {}> {
  featureGroupRef: FeatureGroup;

  constructor(props: any) {
    super(props);
  }

  _onEditPath = (e: any) => {
    this.props.onChange(this.featureGroupRef.leafletElement.toGeoJSON());
  };

  _onCreate = (e: any) => {
    this.props.onChange(this.featureGroupRef.leafletElement.toGeoJSON());
  };

  _onDeleted = (e: any) => {
    this.props.onChange(this.featureGroupRef.leafletElement.toGeoJSON());
  };

  render() {
    return (
      <FeatureGroup
        ref={ref => {
          this.featureGroupRef = ref;
        }}
      >
        <EditControl
          position="topright"
          onEdited={this._onEditPath}
          onCreated={this._onCreate}
          onDeleted={this._onDeleted}
          draw={{
            rectangle: false,
            circlemarker: false
          }}
        />
      </FeatureGroup>
    );
  }
}
