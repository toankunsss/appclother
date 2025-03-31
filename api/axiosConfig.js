import axios from "axios";
const BASE_URL = axios.create({
  baseURL: "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});
export default BASE_URL;
