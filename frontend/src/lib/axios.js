import axios from 'axios';

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/v1`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },  
  (error) => {
    return Promise.reject(error);
  }
);
