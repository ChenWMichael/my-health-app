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
        <Typography variant="h1" gutterBottom>
          Tracking Health
          <br />
          Visualizing Progress
          <br />
          Seeing If I'm Fat or Not
          
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