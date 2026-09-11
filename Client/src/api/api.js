import axios from 'axios';

// please also set me as admin dashboard url when you deploy
export const adminUrl = import.meta.env.VITE_admin_url || "http://localhost:5174"; //change the admin dashboard url when you deploy
// uper pan url change karvu admin dashboard nu.......................
const api = axios.create({
    baseURL : import.meta.env.VITE_backend_url || "http://localhost:5000", //change with backend url
    // headers: { "Content-Type": "application/json" }
    withCredentials: true,

})

api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default api;
