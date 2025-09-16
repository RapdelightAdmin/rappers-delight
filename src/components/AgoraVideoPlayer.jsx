import React, { useEffect } from 'react';
import { AgoraRTCProvider, useRTCClient, useRemoteUsers, useLocalCameraTrack, useLocalMicrophoneTrack, LocalVideoTrack, RemoteUser } from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";

function AgoraVideoPlayer({ appId, channel, token, vocalsGain }) {
  const agoraClient = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));
  const { localCameraTrack } = useLocalCameraTrack();
  const { localMicrophoneTrack } = useLocalMicrophoneTrack();
  const remoteUsers = useRemoteUsers();

  useEffect(() => {
    const joinChannel = async () => {
      if (agoraClient && appId && channel && token) {
        await agoraClient.join(appId, channel, token, null);
      }
    };
    joinChannel();

    return () => {
      const leaveChannel = async () => {
        if (agoraClient) {
          await agoraClient.leave();
        }
      };
      leaveChannel();
    };
  }, [agoraClient, appId, channel, token]);

  useEffect(() => {
    if (vocalsGain) {
      remoteUsers.forEach(user => {
        if (user.hasAudio) {
          const audioTrack = user.audioTrack;
          if (audioTrack) {
            const mediaStreamTrack = audioTrack.getMediaStreamTrack();
            const mediaStream = new MediaStream([mediaStreamTrack]);
            const source = vocalsGain.context.createMediaStreamSource(mediaStream);
            source.connect(vocalsGain);
          }
        }
      });
    }
  }, [remoteUsers, vocalsGain]);


  return (
    <AgoraRTCProvider client={agoraClient}>
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <LocalVideoTrack track={localCameraTrack} play={true} style={{ width: remoteUsers.length > 0 ? "50%" : "100%", height: "100%" }} />
        {remoteUsers.map(user => (
          <RemoteUser user={user} key={user.uid} playVideo={true} playAudio={true} style={{ width: "50%", height: "100%" }} />
        ))}
      </div>
    </AgoraRTCProvider>
  );
}

export default AgoraVideoPlayer;
