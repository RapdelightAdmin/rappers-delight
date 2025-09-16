import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { ref, onValue, off } from 'firebase/database';
import { database } from '../firebase';

function ViewerList({ livestreamId }) {
  const [viewers, setViewers] = useState([]);

  useEffect(() => {
    if (!livestreamId) return;

    const viewersRef = ref(database, `livestreams/${livestreamId}/viewers`);
    const listener = onValue(viewersRef, (snapshot) => {
      const viewersData = snapshot.val();
      const loadedViewers = viewersData ? Object.values(viewersData) : [];
      setViewers(loadedViewers);
    });

    return () => off(viewersRef, 'value', listener);
  }, [livestreamId]);

  return (
    <Box sx={{ p: 2, background: '#2c2c2c', borderRadius: '16px', mt: 2 }}>
      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold', mb: 1 }}>
        Viewers ({viewers.length})
      </Typography>
      <List dense>
        {viewers.map((viewer) => (
          <ListItem key={viewer.uid}>
            <ListItemText primary={viewer.displayName} sx={{ color: '#fff' }} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default ViewerList;
