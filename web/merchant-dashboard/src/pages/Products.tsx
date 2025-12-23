import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

export default function Products() {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Products
            </Typography>
            <Paper sx={{ p: 3 }}>
                <Typography>Product management interface coming soon...</Typography>
            </Paper>
        </Box>
    );
}
