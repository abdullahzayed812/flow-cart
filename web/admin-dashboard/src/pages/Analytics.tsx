import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

export default function Analytics() {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Platform Analytics
            </Typography>
            <Paper sx={{ p: 3 }}>
                <Typography>Platform analytics and insights coming soon...</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                    Features: Revenue trends, user growth, merchant performance, popular products
                </Typography>
            </Paper>
        </Box>
    );
}
