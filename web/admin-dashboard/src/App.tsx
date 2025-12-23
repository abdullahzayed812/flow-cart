import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Merchants from './pages/Merchants';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Analytics from './pages/Analytics';
import Layout from './components/Layout';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

function PrivateRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
    const { loadUser } = useAuthStore();

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <Layout />
                            </PrivateRoute>
                        }
                    >
                        <Route index element={<Dashboard />} />
                        <Route path="users" element={<Users />} />
                        <Route path="merchants" element={<Merchants />} />
                        <Route path="products" element={<Products />} />
                        <Route path="orders" element={<Orders />} />
                        <Route path="analytics" element={<Analytics />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
