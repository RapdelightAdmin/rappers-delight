import React from 'react';
import { Box, IconButton } from '@mui/material';

const REACTIONS = ['👍', '❤️', '🎉', '🔥', '😂', '😮'];

function Reactions({ onReaction }) {
  return (
    <Box 
      sx={{ 
        p: 1, 
        background: 'rgba(0,0,0,0.4)', 
        borderRadius: '20px', 
        display: 'flex', 
        gap: 1,
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10
      }}
    >
      {REACTIONS.map((emoji) => (
        <IconButton key={emoji} onClick={() => onReaction(emoji)} size="large">
          <span style={{ fontSize: '1.5rem' }}>{emoji}</span>
        </IconButton>
      ))}
    </Box>
  );
}

export default Reactions;
