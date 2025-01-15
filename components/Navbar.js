import Link from 'next/link';
import {AppBar, Toolbar, Typography, Button } from '@mui/material';

export default function Navbar() {
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography
            component="div"
            sx={{ flexGrow: 1, color: 'inherit' }}
          >
            Check If Michael Is Fat
          </Typography>
          <Link href="/" passHref>
            <Button sx={{ color: 'inherit' }}>Home</Button>
          </Link>
          <Link href="/dashboard" passHref>
            <Button sx={{ color: 'inherit' }}>Dashboard</Button>
          </Link>
          <Button
                    color="inherit"
                    href="/api/download-db"
                    download
                >
                    Download Database
                </Button>
        </Toolbar>
      </AppBar>
    );
  }