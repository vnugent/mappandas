const checkAndPrintWarning = (name: string, value: string) => {
  if (!value.trim()) {
    console.log(`## Warning: ${name} not defined ##`);
  }
}

export const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN
  ? process.env.REACT_APP_MAPBOX_TOKEN
  : "";

checkAndPrintWarning("REACT_APP_MAPBOX_TOKEN", MAPBOX_TOKEN);

export const CLOUDINARY_TOKEN = process.env.REACT_APP_CLOUDINARY_TOKEN
  ? process.env.REACT_APP_CLOUDINARY_TOKEN
  : "";

checkAndPrintWarning("REACT_APP_CLOUDINARY_TOKEN", CLOUDINARY_TOKEN);

export const API_SERVER = process.env.REACT_APP_API_SERVER
  ? process.env.REACT_APP_API_SERVER
  : "";

checkAndPrintWarning("REACT_APP_API_SERVER", API_SERVER);
