import axios from "axios";
import * as Config from "../Config";

export const client = axios.create({
    baseURL: Config.PDXMAP_API
    /* other custom settings */
});


export const getSummary = async (address) => {
    const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "HTTP_REFERER": "mappandas.com",
        "Referer": "https://mappandas.com",
        "Access-Control-Allow-Origin": "mappandas.com",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    };
    const payload = {
        address,
        api_token: Config.PDXMAP_TOKEN
    }
    const res = await client.post("assessor", payload, { headers });
    if (res.status === 200) return res.data;
    return Promise.reject(res);
}