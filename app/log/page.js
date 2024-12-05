'use client';
import { useRouter } from 'next/navigation';
import { Box, Button, Typography } from '@mui/material';

export default function LogPage() {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = 'isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    router.push('/');
  };

  return (
    <Box sx={{ padding: '20px', textAlign: 'center'}}>
        <Button 
            variant="outlined"
            onClick={handleLogout}
            sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                mb: 2 
            }}
        >
            Log Out 
        </Button>
        <Typography variant="h4" gutterBottom>
            Log Data
        </Typography>
    </Box>
  );
}