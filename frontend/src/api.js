import axios from "axios";

const api = axios.create({
  baseURL: "[localhost](http://localhost:8000/api/)",
});

export default api;
