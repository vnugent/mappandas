import axios from "axios";
import { IPanda } from "./types/CustomMapTypes";
import * as GeoHelper from "./GeoHelper";
import { FeatureCollection2 } from "@mappandas/yelapa";

export const client = axios.create({
  baseURL: "https://api.mappandas.com"
  //baseURL: "http://localhost:5000"
  /* other custom settings */
});

export const create = (data: IPanda | FeatureCollection2): void => {
  const headers = {
    "Content-Type": "application/json"
  };
  let newPanda;

  if (data.hasOwnProperty("uuid")) {
    newPanda = data as IPanda;
  } else
  {
    newPanda = GeoHelper.NEW_PANDA();
    newPanda.geojson = data as FeatureCollection2;
    newPanda.bbox = GeoHelper.bboxFromGeoJson(newPanda.geojson);
  }
  const restPayload = GeoHelper.stringify(newPanda);
  client.post(`/p/${newPanda.uuid}`, restPayload, { headers: headers });
};

export const get = async (uuid: string): Promise<string | undefined> => {
  const response = await client.get<string>(`/p/${uuid}`);
  if (response) {
    return response.data;
  } else {
    return undefined;
  }
};

export const sendMail = (uuid: string, email: string) => {
  const headers = {
    "Content-Type": "application/json"
  };
  const payload = {
    uuid: uuid,
    email: email
  };
  client.post("/email", payload, { headers: headers });
};

export const getLastN = async (limit: number): Promise<Array<any>> => {
  const response = await client.get<Array<any>>(`/lastn/${limit}`);
  if (response) {
    return response.data;
  }
  console.log("getLastN() error");
  return [{}];
};
