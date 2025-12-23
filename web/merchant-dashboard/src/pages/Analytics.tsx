import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

export default function Analytics() {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Analytics
            </Typography>
            <Paper sx={{ p: 3 }}>
                <Typography>Sales analytics and reports coming soon...</Typography>
            </Paper>
        </Box>
    );
}
