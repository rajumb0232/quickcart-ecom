import axios from "axios";

const RAW_API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8081/api/v1";
export const API_BASE = RAW_API_BASE.replace(/\/$/, ""); // remove trailing slash
export const api = axios.create({ baseURL: API_BASE });

