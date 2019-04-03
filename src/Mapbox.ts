import axios from "axios";
import { Feature } from "geojson";
import * as Config from "./Config";

const MAPBOX_TOKEN = Config.MAPBOX_TOKEN;
/**
 * Perform geocoder look up and return the first match
 * @param query Search string. Eg: Portland, Oregon
 * @param apiToken Mapbox token
 * @param options Mapbox Geocoder API option
 */
export const geocoder_lookup1 = async (
  query: string,
  options = {}
): Promise<Feature> => {
  const safeQuery = encodeURI(query);
  const opts = Object.keys(options)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(options[k])}`)
    .join("&");
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${safeQuery}.json?access_token=${MAPBOX_TOKEN}&limit=1&${opts}`;
  const response = await axios.get(url);
  return response.status === 200 && response.data && response.data.features[0]
    ? response.data.features[0]
    : Promise.reject({ msg: "Unable to geo-look up", response: response });
};
