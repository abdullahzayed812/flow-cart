import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthService from '../services/auth.service';

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
    register: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    login: async (email: string, password: string) => {
        try {
            const response = await AuthService.login({ email, password });
            const { access_token, refresh_token, user } = response.data;

            await AsyncStorage.multiSet([
                ['access_token', access_token],
                ['refresh_token', refresh_token],
                ['user', JSON.stringify(user)],
            ]);

            set({ user, isAuthenticated: true });
        } catch (error) {
            throw error;
        }
    },

    register: async (data: any) => {
        try {
            const response = await AuthService.register(data);
            const { access_token, refresh_token, user } = response.data;

            await AsyncStorage.multiSet([
                ['access_token', access_token],
                ['refresh_token', refresh_token],
                ['user', JSON.stringify(user)],
            ]);

            set({ user, isAuthenticated: true });
        } catch (error) {
            throw error;
        }
    },

    logout: async () => {
        await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user']);
        set({ user: null, isAuthenticated: false });
    },

    loadUser: async () => {
        try {
            const userStr = await AsyncStorage.getItem('user');
            const token = await AsyncStorage.getItem('access_token');

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
