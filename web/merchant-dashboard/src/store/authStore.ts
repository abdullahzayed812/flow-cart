import { create } from 'zustand';
import ApiService from '../services/api';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    login: async (email: string, password: string) => {
        const response: any = await ApiService.post('/auth/login', { email, password });
        const { access_token, refresh_token, user } = response.data;

        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('user', JSON.stringify(user));

        set({ user, isAuthenticated: true });
    },

    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        set({ user: null, isAuthenticated: false });
    },

    loadUser: async () => {
        try {
            const userStr = localStorage.getItem('user');
            const token = localStorage.getItem('access_token');

            if (userStr && token) {
                const user = JSON.parse(userStr);
                set({ user, isAuthenticated: true, isLoading: false });
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            set({ isLoading: false });
        }
    },
}));
