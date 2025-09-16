import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

const livestreams = [
  { id: 'livestream1', title: 'Live Jam Session', artist: 'The Funky Bunch' },
  { id: 'livestream2', title: 'Acoustic Set', artist: 'Sarah Sings' },
  { id: 'livestream3', title: 'DJ Mix', artist: 'DJ Beatmaster' },
];

function Home() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: '#fff', fontWeight: 'bold', mb: 4 }}>
        Happening Now
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
        {livestreams.map((stream) => (
          <Paper 
            key={stream.id} 
            sx={{ 
              p: 3, 
              borderRadius: '16px', 
              background: '#1e1e1e', 
              boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
              }
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff' }}>{stream.title}</Typography>
            <Typography variant="body2" sx={{ color: '#ccc', mb: 2 }}>{stream.artist}</Typography>
            <Button 
              component={Link} 
              to={`/livestream/${stream.id}`} 
              variant="contained" 
              sx={{
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                borderRadius: '20px'
              }}
            >
              Join Stream
            </Button>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}

export default Home;
