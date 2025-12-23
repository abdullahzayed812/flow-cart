import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { useAuthStore } from './src/store/authStore';

export default function App() {
    const loadUser = useAuthStore((state) => state.loadUser);

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle="dark-content" />
            <AppNavigator />
        </SafeAreaView>
    );
}
