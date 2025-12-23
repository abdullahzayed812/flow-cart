import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

export default function Merchants() {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Merchant Management
            </Typography>
            <Paper sx={{ p: 3 }}>
                <Typography>Merchant management interface coming soon...</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                    Features: Approve/reject merchant applications, view merchant stores, manage payouts
                </Typography>
            </Paper>
        </Box>
    );
}
