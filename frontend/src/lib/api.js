// src/lib/api.js

import axios from "axios";
import { toast } from "react-toastify";

// Main API for authenticated requests
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:4000",
});

// Add auth token only to protected requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    // Don't toast every error — let components handle public ones
    return Promise.reject(err);
  }
);

// NEW: Public API instance — NO auth header ever
export const publicApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:4000",
});

publicApi.interceptors.response.use(
  (res) => res,
  (err) => {
    // Don't auto-redirect on 401/403 for public routes
    return Promise.reject(err);
  }
);

export default api;
