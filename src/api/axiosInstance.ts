import axios from 'axios';
import baseUrl from './baseUrl';

const axiosInstance = axios.create({
  baseURL: baseUrl,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (
      config.url?.includes('/auth/login') ||
      config.url?.includes('/auth/signup')
    ) {
      return config;
    }
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance; 