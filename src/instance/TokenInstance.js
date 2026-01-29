import axios from "axios";

const api = axios.create({
 

        	baseURL : "http://13.48.115.111:3000/api"  
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); 
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
