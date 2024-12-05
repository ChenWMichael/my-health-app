'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, TextField, Button } from "@mui/material";

export default function AdminPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const router = useRouter();

    const handleLogin = () => {
        if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
            document.cookie = 'isAuthenticated=true; path=/';
          router.push('/log');
        } else {
          setError(true);
        }
    };

    return (
        <Box sx={{
            padding: '10px',
            minHeight: '30vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
        }}>
            <Typography variant="h4" gutterBottom>
                Admin Login
            </Typography>
            <TextField
                type="password"
                label="Enter Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                sx={{ maxWidth: '400px', margin: '0 auto' }}
            />
            {error && (
            <Typography color="error" sx={{ marginTop: '10px' }}>
                Why are you trying to log data as me? 🤔
            </Typography>
            )}
            <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: '20px' }}
                onClick={handleLogin}
            >
                Login
            </Button>
        </Box>
    );
}