import React, { useEffect, useState } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
} from '@mui/material';
import {
    TrendingUp,
    ShoppingCart,
    Inventory,
    AttachMoney,
} from '@mui/icons-material';
import ApiService from '../services/api';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        pendingOrders: 0,
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Mock data - replace with actual API calls
            setStats({
                totalOrders: 156,
                totalRevenue: 12450.50,
                totalProducts: 45,
                pendingOrders: 12,
            });
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const StatCard = ({ title, value, icon, color }: any) => (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography color="textSecondary" gutterBottom variant="body2">
                            {title}
                        </Typography>
                        <Typography variant="h4">{value}</Typography>
                    </Box>
                    <Box
                        sx={{
                            backgroundColor: color,
                            borderRadius: 2,
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Orders"
                        value={stats.totalOrders}
                        icon={<ShoppingCart sx={{ color: 'white' }} />}
                        color="#1976d2"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Revenue"
                        value={`$${stats.totalRevenue.toFixed(2)}`}
                        icon={<AttachMoney sx={{ color: 'white' }} />}
                        color="#2e7d32"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Products"
                        value={stats.totalProducts}
                        icon={<Inventory sx={{ color: 'white' }} />}
                        color="#ed6c02"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Pending Orders"
                        value={stats.pendingOrders}
                        icon={<TrendingUp sx={{ color: 'white' }} />}
                        color="#9c27b0"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Recent Orders
                        </Typography>
                        <Typography color="textSecondary">
                            Order management coming soon...
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Quick Actions
                        </Typography>
                        <Typography color="textSecondary">
                            Actions panel coming soon...
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
