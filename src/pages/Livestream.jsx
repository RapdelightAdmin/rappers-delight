import React, { useEffect, useState, useRef } from 'react';
import { Grid, Paper, Typography, TextField, Button, Box, Slider } from '@mui/material';
import { database, auth } from '../firebase';
import { ref, push, onValue, off } from 'firebase/database';
import AgoraVideoPlayer from '../components/AgoraVideoPlayer';
import { onAuthStateChanged } from 'firebase/auth';

function Livestream() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [instrumentalVolume, setInstrumentalVolume] = useState(50);
  const [vocalsVolume, setVocalsVolume] = useState(50);
  const [instrumental, setInstrumental] = useState(null);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);
  const audioContextRef = useRef(null);
  const instrumentalSourceRef = useRef(null);
  const instrumentalGainRef = useRef(null);
  const vocalsGainRef = useRef(null);

  const livestreamId = 'livestream1'; // This would typically come from the route
  const chatRef = ref(database, `chats/${livestreamId}`);

  const agoraAppId = '4b2f7bbd2ec047658ec7bf1963f649fa';
  const agoraChannel = 'main';
  const agoraToken = '007eJxTYKjqrbFNDrCc7m3rlMXMyL1N/6Rj5qm3Yc85Y9ScvY6aXlFgMEkySjNPSkoxSk02MDE3M7VITTZPSjO0NDNOMzOxTEv0WXoioyGQkcGCu5iJkQECQXw2BufMgozUIgYGAJWVHQo=';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    instrumentalGainRef.current = audioContextRef.current.createGain();
    vocalsGainRef.current = audioContextRef.current.createGain();
    instrumentalGainRef.current.connect(audioContextRef.current.destination);
    vocalsGainRef.current.connect(audioContextRef.current.destination);
  }, []);

  useEffect(() => {
    onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      const messageList = data ? Object.values(data) : [];
      setMessages(messageList);
    });

    return () => off(chatRef);
  }, [chatRef]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (instrumentalGainRef.current) {
      instrumentalGainRef.current.gain.value = instrumentalVolume / 100;
    }
  }, [instrumentalVolume]);

  useEffect(() => {
    if (vocalsGainRef.current) {
      vocalsGainRef.current.gain.value = vocalsVolume / 100;
    }
  }, [vocalsVolume]);

  useEffect(() => {
    if (instrumental && audioContextRef.current) {
      if (instrumentalSourceRef.current) {
        instrumentalSourceRef.current.stop();
      }
      const reader = new FileReader();
      reader.onload = async (e) => {
        const audioData = e.target.result;
        try {
          const buffer = await audioContextRef.current.decodeAudioData(audioData);
          const source = audioContextRef.current.createBufferSource();
          source.buffer = buffer;
          source.connect(instrumentalGainRef.current);
          source.start(0);
          instrumentalSourceRef.current = source;
        } catch (error) {
          console.error('Error decoding audio data:', error);
        }
      };
      reader.readAsArrayBuffer(instrumental);
    }
  }, [instrumental]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && user) {
      push(chatRef, {
        author: user.displayName || user.email,
        text: newMessage,
        timestamp: Date.now(),
      });
      setNewMessage('');
    }
  };

  const handleInstrumentalUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInstrumental(file);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      <Box sx={{ flex: 1, position: 'relative', background: 'black' }}>
        <AgoraVideoPlayer appId={agoraAppId} channel={agoraChannel} token={agoraToken} vocalsGain={vocalsGainRef.current} />
      </Box>

      <Box sx={{ width: 350, display: 'flex', flexDirection: 'column', borderLeft: '1px solid #333' }}>
        <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#fff', fontWeight: 'bold' }}>Live Chat</Typography>
          {messages.map((msg, index) => (
            <Typography key={index} variant="body2" sx={{ mb: 1, color: '#ccc' }}>
              <Box component="span" sx={{ fontWeight: 'bold', color: '#90caf9' }}>{msg.author}:</Box> {msg.text}
            </Typography>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2, borderTop: '1px solid #333' }}>
          <TextField
            label="Say something..."
            variant="filled"
            fullWidth
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            sx={{ 
              '& .MuiFilledInput-root': { 
                backgroundColor: '#333', 
                borderRadius: '20px', 
                '&:hover': { backgroundColor: '#444' } 
              },
              '& .MuiInputLabel-root': { color: '#aaa' },
            }}
          />
          <Button type="submit" variant="contained" sx={{ display: 'none' }}>Send</Button>
        </Box>

        <Box sx={{ p: 2, borderTop: '1px solid #333', background: '#1e1e1e' }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#fff', fontWeight: 'bold' }}>Mixing Console</Typography>
          <Box>
            <Typography gutterBottom sx={{ color: '#ccc' }}>Instrumental</Typography>
            <Slider value={instrumentalVolume} onChange={(e, newValue) => setInstrumentalVolume(newValue)} aria-labelledby="instrumental-volume-slider" />
            <Typography gutterBottom sx={{ color: '#ccc' }}>Vocals</Typography>
            <Slider value={vocalsVolume} onChange={(e, newValue) => setVocalsVolume(newValue)} aria-labelledby="vocals-volume-slider" />
            <Button 
              variant="contained" 
              component="label" 
              fullWidth sx={{ 
                mt: 2, 
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                borderRadius: '20px'
              }}
            >
              Upload Instrumental
              <input type="file" hidden onChange={handleInstrumentalUpload} accept="audio/*" />
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Livestream;
