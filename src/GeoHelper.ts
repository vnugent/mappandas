import axios from "axios";
import bbox from "@turf/bbox";
import { FeatureCollection } from "geojson";
import { LatLngBounds, LatLng } from "leaflet";
import { IPanda } from "./types/CustomMapTypes";

const uuidv1 = require("uuid/v1");

export const NEW_PANDA = (): IPanda => ({
  uuid: uuidv1(),
  geojson: {
    type: "FeatureCollection",
    features: []
  },
  bbox: new LatLngBounds([[0, 0], [0, 0]]),
  description: ""
});

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

export const bboxFromGeoJson = (geojson: FeatureCollection): LatLngBounds => {
  if (
    geojson.features.length === 1 &&
    geojson.features[0].geometry.type === "Point"
  ) {
    // turn a single point into a box
    const point = geojson.features[0].geometry.coordinates;
    const sw = new LatLng(point[1] - 0.5, point[0] - 0.5);
    const ne = new LatLng(point[1] + 0.5, point[0] + 0.5);
    return new LatLngBounds(sw, ne);
  }

  const _bbox = bbox(geojson);
  const sw = new LatLng(_bbox[1], _bbox[0]);
  const ne = new LatLng(_bbox[3], _bbox[2]);
  return new LatLngBounds(sw, ne);
};

export const stringify = (panda: IPanda) => {
  const bbox = panda.bbox;
  const bboxArray = [
    [bbox.getSouth(), bbox.getWest()],
    [bbox.getNorth(), bbox.getEast()]
  ];
  return JSON.stringify({
    uuid: panda.uuid,
    bbox: bboxArray,
    description: panda.description,
    geojson: panda.geojson
  });
};

export const parse = (s: string, options?: any): IPanda => {
  const data = options && options.json ? s : JSON.parse(s);
  return {
    uuid: data.uuid,
    bbox: new LatLngBounds(data.bbox),
    description: data.description,
    geojson: data.geojson
  };
};
