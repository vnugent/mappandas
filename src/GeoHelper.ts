import axios from "axios";

import bbox from "@turf/bbox";
import { FeatureCollection, BBox } from "geojson";
import { FeatureCollection2 } from "@mappandas/yelapa";
import { LatLng, Bbox0, IPanda } from "./types/CustomMapTypes";

import * as ViewportUtils from "viewport-mercator-project";

const uuidv1 = require("uuid/v1");

export const DEFAULT_LATLNG: LatLng = {
  latitude: 37.7577,
  longitude: -122.4376
};

export const NEW_FC = (): FeatureCollection2 => ({
  type: "FeatureCollection",
  properties: {
    uuid: uuidv1(),
    title: "",
    summary: []
  },
  features: []
});

export const NEW_PANDA = (): IPanda => ({
  uuid: uuidv1(),
  geojson: NEW_FC(),
  bbox: [0, 0, 0, 0],
  description: ""
});

export const INITIAL_VIEWSTATE = () => ({
  altitude: 0,
  //   width: window.innerWidth,
  //   height: window.innerHeight,
  width: 400,
  height: 250,
  zoom: 12,
  pitch: 40,
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
  if (
    geojson.features.length === 1 &&
    geojson.features[0].geometry.type === "Point"
  ) {
    // turn a single point into a buffered box
    const point = geojson.features[0].geometry.coordinates;
    return [
      point[0] - 0.005,
      point[1] - 0.005,
      point[0] + 0.005,
      point[1] + 0.005
    ];
  }

  const _bbox = bbox(geojson);
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

export const bbox2Viewport = (bbox: BBox, width: number, height: number) => {
  return ViewportUtils.fitBounds({
    width: width,
    height: height,
    bounds: [bbox.slice(0, 2), bbox.slice(2, 4)],
    padding: Math.min(width, height) * 0.2
  });
};

export const geojson2string = (fc: FeatureCollection2) => {
  const { properties, features } = fc;

  let s = "";
  if (properties) {
    const title = properties.title ? properties.title : null;
    const summary = properties.summary ? properties.summary : null;
    s = [title, summary].join("\n");
  }

  features.forEach(feature => {
    const properties = feature.properties;
    const name = properties ? properties.name : "";
    const summary =
      properties && properties.description
        ? properties.description.join("\n")
        : "";
    s = s + "\n--\n" + [name, summary].join("\n");
  });

  return s;
};
