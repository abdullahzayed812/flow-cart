import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

export default function Orders() {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Global Order Monitoring
            </Typography>
            <Paper sx={{ p: 3 }}>
                <Typography>Global order monitoring interface coming soon...</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                    Features: View all orders across platform, filter by status, merchant, date range
                </Typography>
            </Paper>
        </Box>
    );
}
