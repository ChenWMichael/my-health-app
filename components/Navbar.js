import Link from 'next/link';
import {AppBar, Toolbar, Typography, Button } from '@mui/material';

export default function Navbar() {
    return (
        <AppBar position = "static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                My Health App
                </Typography>
                <Link href="/" passHref>
                <Button color="inherit">Home</Button>
                </Link>
                <Link href="/log" passHref>
                <Button color="inherit">Log</Button>
                </Link>
                <Link href="/dashboard" passHref>
                <Button color="inherit">Dashboard</Button>
                </Link>
            </Toolbar>
        </AppBar>
    );
}