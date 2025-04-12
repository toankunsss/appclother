import axios from "axios";
const BASE_URL = axios.create({
  baseURL: "http://10.0.60.121:3000",
  headers: { "Content-Type": "application/json" },
});
export default BASE_URL;
