import { FeatureCollection2 } from "@mappandas/yelapa";
import { Feature } from "@turf/helpers";

/**
 * {Latitude, Longitude}
 */
export type LatLng = { latitude: number; longitude: number };

/**
 * Bounding box
 */
export type Bbox0 = [number, number, number, number];

export interface IPost {
    uuid: string,
    bbox: Bbox0;
    userid: string;
    content: any; // Slate 'value'
}

export interface IPanda {
  uuid: string;
  geojson: FeatureCollection2;
  bbox: Bbox0;
  description: string;
}

export interface IActiveFeature {
  x: number;
  y: number;
  index: number;
  object?: Feature<any>;
}
