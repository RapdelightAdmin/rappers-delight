import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Paper, Typography, TextField, Button, Box, Slider, List, ListItem, ListItemText, Modal } from '@mui/material';
import { database, auth } from '../firebase';
import { ref, push, onValue, off, set, remove, onDisconnect, runTransaction } from 'firebase/database';
import AgoraVideoPlayer from '../components/AgoraVideoPlayer';
import { onAuthStateChanged } from 'firebase/auth';
import Chat from '../components/Chat';
import ViewerList from '../components/ViewerList';
import Reactions from '../components/Reactions';
import '../components/Reactions.css';
import CreatePoll from '../components/CreatePoll';
import Poll from '../components/Poll';
import '../components/Poll.css';

function Livestream() {
  const { id: livestreamId } = useParams();
  const [instrumentalVolume, setInstrumentalVolume] = useState(50);
  const [vocalsVolume, setVocalsVolume] = useState(50);
  const [instrumental, setInstrumental] = useState(null);
  const [user, setUser] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [joinRequests, setJoinRequests] = useState([]);
  const [agoraToken, setAgoraToken] = useState(null);
  const [reactions, setReactions] = useState([]);
  const [activePoll, setActivePoll] = useState(null);
  const [openCreatePoll, setOpenCreatePoll] = useState(false);
  const audioContextRef = useRef(null);
  const instrumentalSourceRef = useRef(null);
  const instrumentalGainRef = useRef(null);
  const vocalsGainRef = useRef(null);

  const agoraAppId = import.meta.env.VITE_AGORA_APP_ID;
  const agoraChannel = livestreamId;

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch(`http://localhost:8080/rtc?channelName=${livestreamId}`);
        const data = await response.json();
        setAgoraToken(data.token);
      } catch (error) {
        console.error("Error fetching Agora token:", error);
      }
    };

    if (livestreamId) {
      fetchToken();
    }
  }, [livestreamId]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (livestreamId && currentUser) {
        const livestreamRef = ref(database, `livestreams/${livestreamId}`);
        onValue(livestreamRef, (snapshot) => {
          const data = snapshot.val();
          setIsHost(data.hostId === currentUser.uid);
        });

        const viewerRef = ref(database, `livestreams/${livestreamId}/viewers/${currentUser.uid}`);
        set(viewerRef, { 
          uid: currentUser.uid, 
          displayName: currentUser.isAnonymous ? "Anonymous" : currentUser.displayName || "User" 
        });
        onDisconnect(viewerRef).remove();
      }
    });
    return () => unsubscribe();
  }, [livestreamId]);

  useEffect(() => {
    if (!livestreamId) return;
    const requestsRef = ref(database, `livestreams/${livestreamId}/requests`);
    const listener = onValue(requestsRef, (snapshot) => {
      const requestsData = snapshot.val();
      const loadedRequests = requestsData ? Object.values(requestsData) : [];
      setJoinRequests(loadedRequests);
    });
    return () => off(requestsRef, 'value', listener);
  }, [livestreamId]);

  useEffect(() => {
    const reactionsRef = ref(database, `livestreams/${livestreamId}/reactions`);
    const listener = onValue(reactionsRef, (snapshot) => {
      const reactionsData = snapshot.val();
      if (reactionsData) {
        const newReaction = Object.values(reactionsData).pop(); // Get the last reaction
        setReactions(prev => [...prev, { ...newReaction, id: Date.now() * Math.random() }]);
      }
    });
    return () => off(reactionsRef, 'value', listener);
  }, [livestreamId]);

  useEffect(() => {
    const pollRef = ref(database, `livestreams/${livestreamId}/poll`);
    const listener = onValue(pollRef, (snapshot) => {
      setActivePoll(snapshot.val());
    });
    return () => off(pollRef, 'value', listener);
  }, [livestreamId]);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    instrumentalGainRef.current = audioContextRef.current.createGain();
    vocalsGainRef.current = audioContextRef.current.createGain();
    instrumentalGainRef.current.connect(audioContextRef.current.destination);
    vocalsGainRef.current.connect(audioContextRef.current.destination);
  }, []);

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

  const handleInstrumentalUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInstrumental(file);
    }
  };

  const handleAcceptRequest = (request) => {
    const requestRef = ref(database, `livestreams/${livestreamId}/requests/${request.uid}`);
    remove(requestRef);
    console.log(`Accepted join request from ${request.displayName}`);
  };

  const handleDeclineRequest = (request) => {
    const requestRef = ref(database, `livestreams/${livestreamId}/requests/${request.uid}`);
    remove(requestRef);
  };

  const handleReaction = (emoji) => {
    if (livestreamId && user) {
      const reactionsRef = ref(database, `livestreams/${livestreamId}/reactions`);
      push(reactionsRef, { emoji, uid: user.uid });
    }
  };

  const handleCreatePoll = (pollData) => {
    if (livestreamId && isHost) {
      const pollRef = ref(database, `livestreams/${livestreamId}/poll`);
      set(pollRef, { 
        ...pollData, 
        options: pollData.options.map(o => ({ text: o, votes: 0 })),
        voters: {}
      });
      setOpenCreatePoll(false);
    }
  };

  const handleVote = (optionIndex) => {
    if (livestreamId && user && activePoll && !activePoll.voters[user.uid]) {
      const pollRef = ref(database, `livestreams/${livestreamId}/poll`);
      runTransaction(pollRef, (poll) => {
        if (poll) {
          if (!poll.voters) poll.voters = {};
          if (!poll.voters[user.uid]) {
            poll.options[optionIndex].votes = (poll.options[optionIndex].votes || 0) + 1;
            poll.voters[user.uid] = true;
          }
        }
        return poll;
      });
    }
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      <Box sx={{ flex: 1, position: 'relative', background: 'black' }}>
        {agoraToken && <AgoraVideoPlayer appId={agoraAppId} channel={agoraChannel} token={agoraToken} vocalsGain={vocalsGainRef.current} />}
        {activePoll && <Poll poll={activePoll} onVote={handleVote} user={user} livestreamId={livestreamId} />}
        {reactions.map((reaction) => (
          <div key={reaction.id} className="reaction-animation" style={{ left: `${Math.random() * 80 + 10}%` }}>
            {reaction.emoji}
          </div>
        ))}
        <Reactions onReaction={handleReaction} />
      </Box>

      <Box sx={{ width: 350, display: 'flex', flexDirection: 'column', borderLeft: '1px solid #333' }}>
        <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#fff', fontWeight: 'bold' }}>Live Chat</Typography>
          <Chat livestreamId={livestreamId} />
          <ViewerList livestreamId={livestreamId} />
          
          {isHost && (
            <Button onClick={() => setOpenCreatePoll(true)} variant="contained" fullWidth sx={{ mt: 2 }}>
              Create Poll
            </Button>
          )}

          <Modal open={openCreatePoll} onClose={() => setOpenCreatePoll(false)}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <CreatePoll onCreatePoll={handleCreatePoll} />
            </Box>
          </Modal>

          <Box sx={{ p: 2, background: '#2c2c2c', borderRadius: '16px', mt: 2 }}>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold', mb: 1 }}>
              Join Requests
            </Typography>
            <List dense>
              {joinRequests.map((request) => (
                <ListItem key={request.uid}>
                  <ListItemText primary={request.displayName} sx={{ color: '#fff' }} />
                  <Button size="small" onClick={() => handleAcceptRequest(request)}>Accept</Button>
                  <Button size="small" color="error" onClick={() => handleDeclineRequest(request)}>Decline</Button>
                </ListItem>
              ))}
            </List>
          </Box>

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
