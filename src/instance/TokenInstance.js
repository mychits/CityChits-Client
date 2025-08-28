import axios from "axios";

const api = axios.create({
  // baseURL: "https://mychits.online/api",
  // baseURL: "http://13.61.139.208:3000/api",
  baseURL: "http://51.21.197.152:3000/api",
  // baseURL: "http://localhost:3000/api",
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("Token"); 
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
