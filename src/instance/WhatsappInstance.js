import axios from "axios";
const whatsappApi = axios.create({
  baseURL: "http://51.21.197.152:3000/whatsapp/message", 
  // baseURL: "http://localhost:3000/whatsapp/message",
 
});

export default whatsappApi;
