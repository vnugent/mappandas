import axios from "axios";
import {FeatureCollection} from "geojson";

export const client = axios.create({
  baseURL: "https://api.mappandas.com"
  /* other custom settings */
});

export const create = (uuid: string, geojson: object): void => {
  client.post(`/p/${uuid}`, geojson);
};

export const get = async (uuid: string): Promise<FeatureCollection> => {
  const response = await client.get<FeatureCollection>(`/p/${uuid}`);
  if (response) {
    return response.data;
  } else {
    return {
      type: "FeatureCollection",
      features: []
    };
  }
};
