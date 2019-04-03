import { useDropzone } from "react-dropzone";
import axios from "axios";

import * as Config from "../Config";

export const loadPhotoFromDevice = (onSucess: any) => {
  const { open } = useDropzone({
    accept: "image/*",
    multiple: false,
    minSize: 16,
    maxSize: 1024 * 500,
    onDrop: acceptedFiles => {
      if (acceptedFiles.length === 1) {
        onSucess(acceptedFiles[0]);
      }
    }
  });
  open();
};

const client = axios.create({
  baseURL: "https://api.cloudinary.com/v1_1/mappandas"
});

export const uploadImage = async imageData => {
  const payload = new FormData();
  payload.append("name", "file");
  payload.append("file", imageData);
  payload.append("upload_preset", Config.CLOUDINARY_TOKEN);

  const res = await client.post("/image/upload", payload);
  if (res.status === 200) return res.data["secure_url"];
  return Promise.reject("Error uploading image");
};
