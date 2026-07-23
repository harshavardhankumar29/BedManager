// src/api/api.js
import axios from "axios";

let rawURL = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL || "http://localhost:5001/api";
if (rawURL && !rawURL.endsWith("/api") && !rawURL.endsWith("/api/")) {
  rawURL = rawURL.replace(/\/$/, "") + "/api";
}

export const API = axios.create({
  baseURL: rawURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
