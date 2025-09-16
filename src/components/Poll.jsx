import React from 'react';
import { Box, Typography, Button, LinearProgress } from '@mui/material';
import './Poll.css';

function Poll({ poll, onVote, user, livestreamId }) {
  if (!poll) return null;

  const totalVotes = poll.options.reduce((sum, option) => sum + (option.votes || 0), 0);

  return (
    <Box className="poll-container">
      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>{poll.question}</Typography>
      <Box sx={{ mt: 2 }}>
        {poll.options.map((option, index) => {
          const votePercentage = totalVotes > 0 ? ((option.votes || 0) / totalVotes) * 100 : 0;
          return (
            <Box key={index} sx={{ my: 1 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => onVote(index)}
                disabled={!user}
                sx={{ justifyContent: 'space-between' }}
              >
                <Typography>{option.text}</Typography>
                {totalVotes > 0 && <Typography>{votePercentage.toFixed(0)}%</Typography>}
              </Button>
              {totalVotes > 0 && 
                <LinearProgress variant="determinate" value={votePercentage} sx={{ mt: 0.5 }} />
              }
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default Poll;
