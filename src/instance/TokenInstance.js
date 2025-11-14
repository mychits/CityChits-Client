import axios from "axios";

const api = axios.create({
 
  // baseURL: "http://4.240.96.223:3000/api/",

  	// baseURL: "http://localhost:3000/api", 

      // baseURL: "https://citychit-prod-node.onrender.com/api",

      // baseURL : "https://citychit-prod-node-pat4-git-main-mychits-projects.vercel.app/api"

      	// baseURL: "http://51.21.197.152:3000/api",

        	baseURL : "http://13.48.115.111:3000/api"   //NEW BASE URL
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
