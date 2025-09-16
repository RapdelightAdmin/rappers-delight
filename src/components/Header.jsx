import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <AppBar position="static" sx={{ background: '#1e1e1e', boxShadow: 'none' }}>
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>
          Rapper's Delight
        </Typography>
        <div style={{ flexGrow: 1 }} />
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/create">Create Stream</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
