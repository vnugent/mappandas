import axios from "axios";
import bbox from "@turf/bbox";
import { FeatureCollection } from "geojson";
import { LatLng } from "leaflet";
import * as ViewportUtils from "viewport-mercator-project";

import { IPanda } from "./types/CustomMapTypes";

const uuidv1 = require("uuid/v1");

export const NEW_FC = (): FeatureCollection => ({
  type: "FeatureCollection",
  features: []
});

export const NEW_PANDA = (): IPanda => ({
  uuid: uuidv1(),
  geojson: NEW_FC(),
  bbox: [[0, 0], [0, 0]],
  description: ""
});

export const INITIAL_VIEWSTATE = {
  width: window.innerWidth,
  height: window.innerHeight,
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 12,
  pitch: 40
};

export const getLatLngFromIP = async (): Promise<LatLng | undefined> => {
  try {
    const response = await axios.get(
      "https://api.ipgeolocation.io/ipgeo?apiKey=95f145109e96461794291b908055398d&fields=latitude,longitude"
    );
    return new LatLng(response.data.latitude, response.data.longitude);
  } catch (error) {
    console.error("getLatLngFromIP() error ", error);
    return undefined;
  }
};

export const bboxFlip = bbox => [[bbox[1], bbox[0]], [bbox[3], bbox[2]]];

export const bboxFromGeoJson = (
  geojson: FeatureCollection
): [number, number][] => {
  if (
    geojson.features.length === 1 &&
    geojson.features[0].geometry.type === "Point"
  ) {
    // turn a single point into a buffered box
    const point = geojson.features[0].geometry.coordinates;
    const sw: [number, number] = [point[0] - 0.005, point[1] - 0.005];
    const ne: [number, number] = [point[0] + 0.005, point[1] + 0.005];
    return [sw, ne];
  }

  const _bbox = bbox(geojson);
  const sw: [number, number] = [_bbox[0], _bbox[1]];
  const ne: [number, number] = [_bbox[2], _bbox[3]];
  return [sw, ne];
};

export const stringify = (panda: IPanda) => {
  //   const bbox = panda.bbox;
  //   const bboxArray = [
  //     [bbox.getSouth(), bbox.getWest()],
  //     [bbox.getNorth(), bbox.getEast()]
  //   ];
  return JSON.stringify({
    uuid: panda.uuid,
    bbox: panda.bbox,
    description: panda.description,
    geojson: panda.geojson
  });
};

export const parse = (s: string, options?: any): IPanda => {
  const data = options && options.json ? s : JSON.parse(s);
  return {
    uuid: data.uuid,
    //bbox: new LatLngBounds(data.bbox),
    bbox: bboxFromGeoJson(data.geojson),
    description: data.description,
    geojson: data.geojson
  };
};

export const bounds2Viewport = (bounds: [number, number][]) => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  return ViewportUtils.fitBounds({
    width: width,
    height: height,
    bounds: bounds,
    padding: 100
  });
};
