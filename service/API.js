import axios from "axios";

const API = axios.create(
  {
    baseURL: "/api",
    withCredentials: true,
  }
);

export default API;
