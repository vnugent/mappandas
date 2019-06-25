import axios from "axios";
import {FlyToInterpolator} from 'deck.gl';
import bbox from "@turf/bbox";
import { FeatureCollection, BBox } from "geojson";
import { LatLng, Bbox0, IPanda } from "./types/CustomMapTypes";

import * as ViewportUtils from "viewport-mercator-project";

const uuidv1 = require("uuid/v1");

export const DEFAULT_LATLNG: LatLng = {
  latitude: 37.7577,
  longitude: -122.4376
  // latitude: 49,
  // longitude: -123
};

export const NEW_FC = (): FeatureCollection => ({
  type: "FeatureCollection",
  features: []
});

// export const NEW_PANDA = (): IPanda => ({
//   uuid: uuidv1(),
//   geojson: NEW_FC(),
//   bbox: [0, 0, 0, 0],
//   description: ""
// });

export const INITIAL_VIEWSTATE = () => ({
  width: 1,
  height: 1,
  bearing: 0,
  zoom: 12,
  pitch: 30,
  transitionDuration: 1000,
  ...DEFAULT_LATLNG
});

export const getLatLngFromIP = async (): Promise<LatLng> => {
  try {
    const response = await axios.get(
      "https://api.ipgeolocation.io/ipgeo?apiKey=95f145109e96461794291b908055398d&fields=latitude,longitude"
    );
    if (isNaN(response.data.latitude) || isNaN(response.data.longitude)) {
      throw new Error("LatLng not a number");
    }
    return {
      latitude: Number(response.data.latitude),
      longitude: Number(response.data.longitude)
    };
  } catch (error) {
    console.error("getLatLngFromIP() error ", error);
    return DEFAULT_LATLNG;
  }
};

export const bboxFromGeoJson = (geojson: FeatureCollection): Bbox0 => {
  const _bbox = bbox(geojson);
  if (_bbox[0] === _bbox[2] && _bbox[1] === _bbox[3]) {
    // if all features are the same point bbox is single point
    // we need to artifically create a small bboxor deck.gl will crash
    return [
        _bbox[0] - 0.005,
        _bbox[1] - 0.005,
        _bbox[2] + 0.005,
        _bbox[3] + 0.005
    ];
  }
  return [_bbox[0], _bbox[1], _bbox[2], _bbox[3]];
};

export const stringify = (panda: IPanda) => {
  return JSON.stringify({
    uuid: panda.uuid,
    bbox: panda.bbox,
    description: panda.description,
    geojson: panda.geojson
  });
};

export const parse = (s: string, options?: any): IPanda => {
  const data = options && options.json ? s : JSON.parse(s);
  if (!data.geojson.properties) data.geojson.properties={}
  data.geojson.properties.uuid = data.uuid;
  return {
    uuid: data.uuid,
    //bbox: new LatLngBounds(data.bbox),
    bbox: bboxFromGeoJson(data.geojson), // re-calculating bbox each time
    description: data.description,
    geojson: data.geojson
  };
};

export const fitbound = (viewport: any, bbox: Bbox0) => {
  const vp = new ViewportUtils.WebMercatorViewport(viewport);
  console.log("#vp", bbox, vp);
  return vp.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], {
    padding: 40
  });

}

export const bbox2Viewport = (bbox: BBox, width: number, height: number) => {
  return ViewportUtils.fitBounds({
    width: width,
    height: height,
    bounds: [bbox.slice(0, 2), bbox.slice(2, 4)],
    padding: Math.min(width, height) * 0.2
  });
};
