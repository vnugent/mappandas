import { FeatureCollection2 } from "@mappandas/yelapa";

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
  geojson: FeatureCollection2;
  bbox: Bbox0;
  description: string;
}
