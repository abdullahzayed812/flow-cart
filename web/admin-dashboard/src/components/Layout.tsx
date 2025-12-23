import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Store as StoreIcon,
    Inventory as ProductsIcon,
    ShoppingCart as OrdersIcon,
    Analytics as AnalyticsIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../store/authStore';

const drawerWidth = 240;

const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Users', icon: <PeopleIcon />, path: '/users' },
    { text: 'Merchants', icon: <StoreIcon />, path: '/merchants' },
    { text: 'Products', icon: <ProductsIcon />, path: '/products' },
    { text: 'Orders', icon: <OrdersIcon />, path: '/orders' },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
];

export default function Layout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Flow Cart - Admin Dashboard
                    </Typography>
                    <Typography variant="body2" sx={{ mr: 2 }}>
                        {user?.firstName} {user?.lastName} (Admin)
                    </Typography>
                    <IconButton color="inherit" onClick={handleLogout}>
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton
                                    selected={location.pathname === item.path}
                                    onClick={() => navigate(item.path)}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}
