import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

export default function Products() {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Product Moderation
            </Typography>
            <Paper sx={{ p: 3 }}>
                <Typography>Product moderation interface coming soon...</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                    Features: View all products, approve/reject listings, manage categories
                </Typography>
            </Paper>
        </Box>
    );
}
