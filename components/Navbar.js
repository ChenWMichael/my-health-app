import Link from 'next/link';
import {AppBar, Toolbar, Typography, Button } from '@mui/material';

export default function Navbar() {
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography
            component="div"
            sx={{ flexGrow: 1, color: '#ffffff' }}
          >
            Michael's Personal Health Tracker
          </Typography>
          <Link href="/" passHref>
            <Button sx={{ color: '#ffffff' }}>Home</Button>
          </Link>
          <Link href="/dashboard" passHref>
            <Button sx={{ color: '#ffffff' }}>Dashboard</Button>
          </Link>
        </Toolbar>
      </AppBar>
    );
  }