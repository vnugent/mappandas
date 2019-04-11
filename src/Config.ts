const checkAndPrintWarning = (name: string) =>
  name.trim() === "" &&
  console.log(`## Warning: REACT_APP_${name} not defined ##`);

export const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN
  ? process.env.REACT_APP_MAPBOX_TOKEN
  : "";

checkAndPrintWarning("MAPBOX_TOKEN");

export const CLOUDINARY_TOKEN = process.env.REACT_APP_CLOUDINARY_TOKEN
  ? process.env.REACT_APP_CLOUDINARY_TOKEN
  : "";

checkAndPrintWarning("CLOUDINARY_TOKEN");

export const API_SERVER = process.env.REACT_APP_API_SERVER
    ? process.env.REACT_APP_API_SERVER
    : "";

    checkAndPrintWarning("API_SERVER");
