// api axios create for admin panel

import axios from 'axios';

const api = axios.create({
    baseURL : import.meta.env.VITE_backend_url, //change the backend url when you deploy
    withCredentials: true,

})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api