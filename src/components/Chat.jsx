import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Paper, Typography } from '@mui/material';
import { database, auth } from '../firebase';
import { ref, push, onValue, off, set } from 'firebase/database';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';

function Chat({ livestreamId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        signInAnonymously(auth).catch((error) => {
          console.error("Anonymous sign-in failed:", error);
        });
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!livestreamId) return;
    const chatRef = ref(database, `livestreams/${livestreamId}/chat`);
    const listener = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      const loadedMessages = data ? Object.values(data) : [];
      setMessages(loadedMessages);
    });
    return () => off(chatRef, 'value', listener);
  }, [livestreamId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && user && livestreamId) {
      const chatRef = ref(database, `livestreams/${livestreamId}/chat`);
      push(chatRef, { 
        text: newMessage, 
        timestamp: Date.now(),
        uid: user.uid,
        displayName: user.isAnonymous ? "Anonymous" : user.displayName || "User"
      });
      setNewMessage('');
    }
  };

  const handleRequestToJoin = () => {
    if (user && livestreamId) {
      const requestRef = ref(database, `livestreams/${livestreamId}/requests/${user.uid}`);
      set(requestRef, { 
        uid: user.uid, 
        displayName: user.isAnonymous ? "Anonymous" : user.displayName || "User" 
      });
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ flex: 1, p: 2, overflowY: 'auto', background: '#2c2c2c' }}>
        {messages.map((msg, index) => (
          <Box key={index} sx={{ mb: 1 }}>
             <Typography variant="body2" sx={{ color: msg.uid === user?.uid ? '#FF8E53' : '#FE6B8B', fontWeight: 'bold' }}>
              {msg.displayName}
            </Typography>
            <Typography variant="body1" sx={{ color: '#fff' }}>{msg.text}</Typography>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Paper>
      <Box component="form" onSubmit={handleSendMessage} sx={{ p: 1, background: '#1e1e1e' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={!user}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
          Send
        </Button>
        <Button variant="contained" fullWidth sx={{ mt: 1 }} onClick={handleRequestToJoin} disabled={!user}>
          Request to Join
        </Button>
      </Box>
    </Box>
  );
}

export default Chat;
