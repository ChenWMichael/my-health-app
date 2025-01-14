'use client';
import Link from "next/link";
import { Typography, Button, Box } from "@mui/material";

// pnpm dev - launch next.js application
export default function Home() {
  return (
    <main>
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <Typography 
        variant="h1" 
        gutterBottom
        sx={{
          wordWrap: 'break-word',
          maxWidth: '90%', // Restricts text width
          fontSize: {
            xs: '2rem', // Small screens
            sm: '3rem', // Medium screens
            md: '4rem', // Larger screens
            lg: '5rem', // Extra-large screens
          },
        }}
        >
          Tracking Health
          <br />
          Visualizing Progress
          <br />
          Check If I'm Fat Or Not
          
        </Typography>
        <Link href="/dashboard" passHref>
          <Button variant="contained" color="primary" size="large">
            View Dashboard
          </Button>
        </Link>
        <Link href="/admin" passHref>
          <Button variant="outlined" color="primary" size="large">
            Log Data
          </Button>
        </Link>
      </Box>
    </main>
  );
}