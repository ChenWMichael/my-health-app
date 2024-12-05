import Link from "next/link";
import { Typography, Button, Box } from "@mui/material";

// pnpm dev - launch next.js application
export default function Home() {
  return (
    <main>
      <Box
        sx={{
          textAlign: 'center',
          padding: '20px',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <Typography variant="h1" gutterBottom>
          Michael's
          <br />
          Personal Health Tracker
        </Typography>
        <Typography variant="h6" gutterBottom>
          Tracking Health
          <br />
          Visualizing Progress
          <br />
          Achieving Goals
        </Typography>
        <Link href="/log" passHref>
          <Button variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
            You are Me
          </Button>
        </Link>
        <Link href="/log" passHref>
          <Button variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
            You are not Me
          </Button>
        </Link>
      </Box>
    </main>
  );
}