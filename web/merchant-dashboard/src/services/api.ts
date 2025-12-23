import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = '/api';

class ApiService {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        this.api.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('access_token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        this.api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const refreshToken = localStorage.getItem('refresh_token');
                        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                            refreshToken,
                        });

                        const { access_token } = response.data.data;
                        localStorage.setItem('access_token', access_token);

                        originalRequest.headers.Authorization = `Bearer ${access_token}`;
                        return this.api(originalRequest);
                    } catch (refreshError) {
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        window.location.href = '/login';
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    async get<T>(url: string) {
        const response = await this.api.get<T>(url);
        return response.data;
    }

    async post<T>(url: string, data?: any) {
        const response = await this.api.post<T>(url, data);
        return response.data;
    }

    async put<T>(url: string, data?: any) {
        const response = await this.api.put<T>(url, data);
        return response.data;
    }

    async delete<T>(url: string) {
        const response = await this.api.delete<T>(url);
        return response.data;
    }
}

export default new ApiService();
