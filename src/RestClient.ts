import axios from "axios";
import { IPanda } from "./types/CustomMapTypes";
import * as GeoHelper from "./GeoHelper";

export const client = axios.create({
  baseURL: "https://api.mappandas.com"
  //baseURL: "http://localhost:5000"
  /* other custom settings */
});

export const create = (panda: IPanda): void => {
  const headers = {
    "Content-Type": "application/json"
  };
  const payload = GeoHelper.stringify(panda);
  client.post(`/p/${panda.uuid}`, payload, { headers: headers });
};

export const get = async (uuid: string): Promise<string | undefined> => {
  const response = await client.get<string>(`/p/${uuid}`);
  if (response) {
    return response.data;
  } else {
    return undefined;
  }
};

export const getLastN = async (limit: number): Promise<Array<any>> => {
  const response = await client.get<Array<any>>(`/lastn/${limit}`);
  if (response) {
    return response.data;
  }
  console.log("getLastN() error");
  return [{}];
};
