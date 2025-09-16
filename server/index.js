require('dotenv').config();
const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const app = express();
const PORT = process.env.PORT || 8080;

// Configuration
const APP_ID = process.env.AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

if (!APP_ID || !APP_CERTIFICATE) {
  console.error("Agora App ID and App Certificate are required.");
  console.error("Please set the AGORA_APP_ID and AGORA_APP_CERTIFICATE environment variables in a .env file.");
  process.exit(1);
}

const nocache = (_, resp, next) => {
  resp.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  resp.header('Expires', '-1');
  resp.header('Pragma', 'no-cache');
  next();
}

const generateRtcToken = (req, resp) => {
  resp.header('Access-Control-Allow-Origin', '*');

  const channelName = req.query.channelName;
  if (!channelName) {
    return resp.status(400).json({ 'error': 'channelName is required' });
  }

  let uid = req.query.uid;
  if (!uid || uid === '') {
    uid = 0;
  }

  let role = RtcRole.SUBSCRIBER;
  if (req.query.role === 'publisher') {
    role = RtcRole.PUBLISHER;
  }

  let expireTime = req.query.expireTime;
  if (!expireTime || expireTime === '') {
    expireTime = 3600; // 1 hour
  } else {
    expireTime = parseInt(expireTime, 10);
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTime + expireTime;

  console.log(`Generating token for channel: ${channelName}, uid: ${uid}, role: ${role}`);

  const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);

  return resp.json({ 'token': token });
};

app.get('/rtc', nocache, generateRtcToken);

app.listen(PORT, () => {
  console.log(`Token server listening on port ${PORT}`);
});
