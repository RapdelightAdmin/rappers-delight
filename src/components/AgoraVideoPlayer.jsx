import React, { useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import {
  AgoraRTCProvider,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
  RemoteUser,
  LocalVideoTrack,
} from 'agora-rtc-react';

const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

function AgoraVideoPlayer({ appId, channel, token, vocalsGain }) {

  return (
    <AgoraRTCProvider client={agoraClient}>
      <Videos channelName={channel} AppID={appId} token={token} vocalsGain={vocalsGain} />
    </AgoraRTCProvider>
  );
}

function Videos({ channelName, AppID, token, vocalsGain }) {
  const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack();
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  const remoteUsers = useRemoteUsers();

  usePublish([localMicrophoneTrack, localCameraTrack]);
  useJoin({
    appid: AppID,
    channel: channelName,
    token: token,
  });

  React.useEffect(() => {
    if (localMicrophoneTrack && vocalsGain) {
      // The volume level can be set from 0 to 100
      localMicrophoneTrack.setVolume(vocalsGain.gain.value * 100);
    }
  }, [localMicrophoneTrack, vocalsGain]);


  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {remoteUsers.map(user => (
          <div key={user.uid} style={{ flex: 1 }}>
            <RemoteUser user={user} playVideo={true} playAudio={true} />
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '200px', height: '150px', zIndex: 1000 }}>
        <LocalVideoTrack track={localCameraTrack} play={true} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}/>
      </div>
    </div>
  );
}

export default AgoraVideoPlayer;
