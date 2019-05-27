import axios from "axios";
import { IPost } from "./types/CustomMapTypes";
import * as Config from "./Config";

export const client = axios.create({
  baseURL: Config.API_SERVER
  /* other custom settings */
});

/**
 * Create a Slate-post
 */
export const createPost = async (post: IPost): Promise<string> => {
  const headers = {
    "Content-Type": "application/json"
  };
  const payload = JSON.stringify(post);
  const res = await client.post(`/p/${post.uuid}`, payload, {
    headers: headers
  });
  if (res.status === 200) {
    return post.uuid;
  }
  return Promise.reject("Unable to create post");
};

export const get = async (uuid: string): Promise<IPost> => {
  try {
    const response = await client.get(`/p/${uuid}`);
    if (response.status === 200) return response.data;
    return Promise.reject(
      "Unable to retrieve data from backend. http code: " + response.status
    );
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getTextFile = async (name: string): Promise<string> => {
  const response = await client.get<string>(name, {
    baseURL: undefined
  });
  return response ? response.data : "";
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

export const getPostsByUser = async (userid: string): Promise<Array<any>> => {
  try {
    const response = await client.get<Array<any>>(`/posts_by_user/${userid}`);
    if (response.status === 200 && response.data) {
       return response.data;
    }
    return Promise.reject(
      "Unable to retrieve data from backend. http code: " + response.status
    );
  } catch (error) {
    return Promise.reject(error);
  }
};
