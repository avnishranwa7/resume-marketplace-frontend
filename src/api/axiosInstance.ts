import axios from "axios";
import baseUrl from "./baseUrl";
import { store } from "../store";

const axiosInstance = axios.create({
  baseURL: baseUrl,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/signup")
    ) {
      return config;
    }
    const auth = store.getState().auth;
    if (auth.token) {
      config.headers["token"] = auth.token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
