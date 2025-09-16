import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import { database, auth } from '../firebase';
import { ref, push, set } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

function CreateStream() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleGoLive = async () => {
    const user = auth.currentUser;
    if (title && description && user) {
      const livestreamsRef = ref(database, 'livestreams');
      const newLivestreamRef = push(livestreamsRef);
      const newLivestreamId = newLivestreamRef.key;

      await set(newLivestreamRef, {
        id: newLivestreamId,
        title,
        description,
        host: {
          uid: user.uid,
          displayName: user.isAnonymous ? "Anonymous" : user.displayName || "User",
        },
        createdAt: Date.now(),
      });

      navigate(`/livestream/${newLivestreamId}`);
    }
  };

  return (
    <Paper sx={{ p: 4, background: '#1e1e1e', borderRadius: '16px' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#fff', fontWeight: 'bold' }}>
        Create a New Livestream
      </Typography>
      <Box>
        <TextField
          label="Livestream Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
          InputLabelProps={{ style: { color: '#ccc' } }}
          inputProps={{ style: { color: '#fff' } }}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 3 }}
          InputLabelProps={{ style: { color: '#ccc' } }}
          inputProps={{ style: { color: '#fff' } }}
        />
        <Button onClick={handleGoLive} variant="contained" color="primary" sx={{ borderRadius: '20px' }}>
          Go Live
        </Button>
      </Box>
    </Paper>
  );
}

export default CreateStream;
