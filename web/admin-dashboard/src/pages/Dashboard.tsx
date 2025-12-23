import React, { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
} from '@mui/material';
import {
    People,
    Store,
    ShoppingCart,
    TrendingUp,
} from '@mui/icons-material';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalMerchants: 0,
        totalOrders: 0,
        totalRevenue: 0,
    });

    useEffect(() => {
        // Mock data - replace with actual API calls
        setStats({
            totalUsers: 1250,
            totalMerchants: 45,
            totalOrders: 3420,
            totalRevenue: 156780.50,
        });
    }, []);

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
                Platform Overview
            </Typography>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers}
                        icon={<People sx={{ color: 'white', fontSize: 40 }} />}
                        color="#1976d2"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Merchants"
                        value={stats.totalMerchants}
                        icon={<Store sx={{ color: 'white', fontSize: 40 }} />}
                        color="#2e7d32"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Orders"
                        value={stats.totalOrders}
                        icon={<ShoppingCart sx={{ color: 'white', fontSize: 40 }} />}
                        color="#ed6c02"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Revenue"
                        value={`$${stats.totalRevenue.toLocaleString()}`}
                        icon={<TrendingUp sx={{ color: 'white', fontSize: 40 }} />}
                        color="#9c27b0"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, height: 400 }}>
                        <Typography variant="h6" gutterBottom>
                            Platform Activity
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                            <Typography color="textSecondary">
                                Activity charts coming soon...
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, height: 400 }}>
                        <Typography variant="h6" gutterBottom>
                            Recent Activity
                        </Typography>
                        <Typography color="textSecondary">
                            Activity feed coming soon...
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
