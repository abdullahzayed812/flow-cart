import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Adjust as needed

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const productService = {
    getAll: () => api.get('/products'),
    updateStatus: (id: string, status: string) => api.patch(`/products/${id}/status`, { status }),
};

export const orderService = {
    getAll: () => api.get('/orders'),
    updateStatus: (id: string, status: string) => api.patch(`/orders/${id}/status`, { status }),
};

export const userService = {
    getAll: () => api.get('/users'),
    updateStatus: (id: string, status: string) => api.patch(`/users/${id}/status`, { status }),
};

export default api;
