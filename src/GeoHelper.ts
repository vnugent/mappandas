import axios from "axios";
import bbox from "@turf/bbox";
import { FeatureCollection } from "geojson";

export const getLatLngFromIP = async (): Promise<
  { lat: number; lng: number } | undefined
> => {
  try {
    const response = await axios.get(
      "http://api.ipstack.com/check?access_key=0cd52c4d1a7b2e5edb3b17f203a8913e&format=2"
    );
    return await { lat: response.data.latitude, lng: response.data.longitude };
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
    const point = geojson.features[0].geometry.coordinates;
    return [[point[1] - 0.5, point[0] - 0.5], [point[1] + 0.5, point[0] + 0.5]];
  }
  const _bbox = bbox(geojson);
  return [[_bbox[1], _bbox[0]], [_bbox[3], _bbox[2]]];
};
