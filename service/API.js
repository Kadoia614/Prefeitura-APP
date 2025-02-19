import axios from "axios";

const API = axios.create(
  {
    baseURL: "http://192.168.16.80:8000",
    withCredentials: true,
  }
);

export default API;
