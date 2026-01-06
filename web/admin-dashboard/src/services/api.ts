import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // Gateway URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const productService = {
  getAll: () => api.get("/warehouse/products"),
  updateStatus: (id: string, status: string) => api.patch(`/warehouse/products/${id}/status`, { status }),
};

export const orderService = {
  getAll: () => api.get("/ecommerce/orders"),
  updateStatus: (id: string, status: string) => api.patch(`/ecommerce/orders/${id}/status`, { status }),
};

export const userService = {
  getAll: () => api.get("/auth/users"),
  updateStatus: (id: string, status: string) => api.patch(`/auth/users/${id}/status`, { status }),
};

export default api;
