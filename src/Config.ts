export const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN
  ? process.env.REACT_APP_MAPBOX_TOKEN
  : "";

  if (MAPBOX_TOKEN.trim() === "") {
      console.log("## Warning: MAPBOX_TOKEN not defined ##");
  }

export const CLOUDINARY_TOKEN = process.env.REACT_APP_CLOUDINARY_TOKEN
? process.env.REACT_APP_CLOUDINARY_TOKEN
: "";

if (CLOUDINARY_TOKEN.trim () === "") {
    console.log("### Warning: REACT_APP_COUNDINARY_TOKEN not defined ###");
}