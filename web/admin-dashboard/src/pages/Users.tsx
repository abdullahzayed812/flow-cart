import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

export default function Users() {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                User Management
            </Typography>
            <Paper sx={{ p: 3 }}>
                <Typography>User management interface with DataGrid coming soon...</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                    Features: View all users, search, filter by role, activate/deactivate accounts
                </Typography>
            </Paper>
        </Box>
    );
}
