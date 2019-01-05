import { FeatureCollection } from "geojson";

/**
 * {Latitude, Longitude}
 */
export type LatLng = { latitude: number; longitude: number };

/**
 * Bounding box
 */
export type Bbox0 = [number, number, number, number];

export interface IPanda {
  uuid: string;
  geojson: FeatureCollection;
  bbox: Bbox0;
  description: string;
}
