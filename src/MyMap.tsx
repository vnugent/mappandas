import * as React from "react";
import { Map, TileLayer } from "react-leaflet";
import { RouteComponentProps } from 'react-router-dom';

import Editor from "./Editor";


interface IMapStateType {
  lat: number;
  lng: number;
  zoom: number;
};

interface IMapPropsType extends RouteComponentProps {
    onChange: Function;
}

export default class MyMap extends React.Component<IMapPropsType, IMapStateType> {
  constructor(props: IMapPropsType) {
    super(props);
    console.log('### ', props.location);
    console.log('### ', props.match.params['lat']);
    
    this.state = {
      ... MyMap.parseParams(props.match.params)
    };
  }

  static parseParams = (params: any): IMapStateType =>   {
    const lat = params['lat'] ? params['lat']: 45.5428; // need to get default Lat
    const lng = params['lng'] ? params['lng']: -122.6544;
    const zoom = params['zoom'] ? params['zoom']: 12;
    return {lat, lng, zoom}
  };
  

  render() {
    const position = [this.state.lat, this.state.lng] as [number, number];
    return (
      <Map center={position} zoom={this.state.zoom}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Editor onChange={this.props.onChange}/>
      </Map>
    );
  }
}
