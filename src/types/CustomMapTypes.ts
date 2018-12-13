import { LatLng } from "leaflet";
import { FeatureCollection } from "geojson";

export interface IViewport {
  center: LatLng;
  zoom: number;
}

export interface IPanda {
  uuid: string;
  geojson: FeatureCollection;
  bbox: [number, number][];
  description: string;
}
