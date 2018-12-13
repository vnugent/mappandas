import { FeatureCollection } from "geojson";

/**
 * [Latitude, Longitude] 
 */
export type LatL0ng = [number, number];

/**
 * Bounding box
 */
export type Bbox0 = [LatL0ng, LatL0ng];

export interface IPanda {
  uuid: string;
  geojson: FeatureCollection;
  bbox: Bbox0;
  description: string;
}
