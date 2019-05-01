import axios from "axios";

import * as Config from "../Config";

const client = axios.create({
  baseURL: "https://api.cloudinary.com/v1_1/mappandas"
});

export const uploadImage = async (imageData, options) => {
  const payload = new FormData();
  payload.append("name", "file");
  payload.append("file", imageData);
  payload.append("upload_preset", Config.CLOUDINARY_TOKEN);
  payload.append("folder", "valencia");
  const context = object2context(options.context);
  options && options.context && payload.append("context", context);

  const res = await client.post("/image/upload", payload);
  if (res.status === 200) return res.data["secure_url"];
  return Promise.reject("Error uploading image");
};

/**
 *  convert object to key=value separated by |
 * @param context cloudinary context object (key:value)
 */
const object2context = context => {
  return context
    ? Object.keys(context)
        .map(key => key + "=" + context[key])
        .join("|")
    : "";
};
