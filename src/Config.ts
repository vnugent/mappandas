export const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN
  ? process.env.REACT_APP_MAPBOX_TOKEN
  : "";

  if (MAPBOX_TOKEN.trim() === "") {
      console.log("## Warning: MAPBOX_TOKEN not defined ##");
  }