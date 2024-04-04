import React from 'react';
import io from 'socket.io-client';
import { useState, useRef ,useEffect} from 'react';
import { useSelector } from "react-redux";

// Define the WebRTCVideoCall component
const WebRTCVideoCall = () => {
  

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [offerData, setOfferData] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  // Define toggleAudio, toggleVideo functions
  const { _id } = useSelector((state) => state.user);
  // Define WebRTC configuration
  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' }
    ]
  };

  // Create a new RTCPeerConnection
  const peerConnection = new RTCPeerConnection(configuration);

// Example: Sending an offer
const sendOffer = async () => {
  try {

    // Create an SDP offer
    const offer = await peerConnection.createOffer();
    // Set local description
    await peerConnection.setLocalDescription(offer);
    console.log("my user id is", _id);
    console.log("the local description",peerConnection.localDescription);
    // Send the SDP offer to the signaling server
    socket.emit('offer', {
      offer: peerConnection.localDescription,
      userId: _id,
    });
    console.log("tba3thet el offer");
  } catch (error) {
    console.error('Error creating or sending offer:', error);
  }
};

  // Set up Socket.IO connection to the signaling server
  const socket = io('http://localhost:8082'); // Replace with your signaling server URL



  socket.on('answer', (answer) => {
    console.log('Received answer raj3et marra okhra:', answer);
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  });

const checkConnectionState = (peerConnection) => {
  console.log("connection state",peerConnection.connectionState );
  return peerConnection.connectionState === 'stable';
};
const handleCallAcceptance = async (offerData) => {
  const{ off ,originateUserIdsocketid } = offerData;
  try {
    // Set the remote description with the offer data
    await peerConnection.setRemoteDescription(new RTCSessionDescription(off));
    console.log("checking loumour hné",off);
    // Create an SDP answer
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    // Send the SDP answer back to the initiator user
    socket.emit('answer', {
      answer: peerConnection.localDescription,
      originateUserIdsocketid: originateUserIdsocketid,
    });
    

  } catch (error) {
    console.error('Error generating or sending SDP answer of the call acceptance:', error);
  }
};

socket.on('offer', async (data) => {

  console.log('Received offer:', data); 
  const{ off ,originateUserIdsocketid } = data;
  console.log("is the offer good",off);
  console.log("the originate socket id :",originateUserIdsocketid)
  try {
 
   
      console.log("peerConnection.localDescription",peerConnection.localDescription)
      setOfferData(data);
      console.log("checking if the offerData const got set ===" ,offerData);


      console.log('Generated and sent SDP answer');
  } catch (error) {
      console.error('Error generating or sending SDP answer:', error);
  }
});

const startMediaStream = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = stream;
    // Add the stream to the peer connection
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
  } catch (error) {
    console.error('Error accessing media devices:', error);
  }
};
peerConnection.ontrack = (event) => {
  // Ensure that the remote video ref is available
  console.log("*****************");
  if (remoteVideoRef.current) {
    // Attach the remote stream to the remote video element
    remoteVideoRef.current.srcObject = event.streams[0];
    console.log("event streams0",event.streams[0] );
    console.log("remoteVideoRef.current.srcObject",remoteVideoRef.current.srcObject);
console.log("1111111111")
  }
};
// Call startMediaStream when the component mounts
useEffect(() => {
  startMediaStream();
  // When remote track arrives, add it to the remote video element

}, []);
const toggleAudio = () => {
  setIsAudioMuted(prevState => !prevState);
};

const toggleVideo = () => {
  setIsVideoEnabled(prevState => !prevState);
};


  // Render your WebRTC video call UI here
  return (
    <div>
     <div>
      <h2>Your Video</h2>
      <video ref={localVideoRef} autoPlay muted style={{ width: '200px', height: '150px', backgroundColor: '#000' }}></video>
    </div>
    <div>
      <h2>Remote Video</h2>
      <video ref={remoteVideoRef} autoPlay style={{ width: '200px', height: '150px', backgroundColor: '#000' }}></video>
    </div>

    {/* Buttons for toggling audio and video */}
    <button onClick={toggleAudio}>
      {isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
    </button>
    <button onClick={toggleVideo}>
      {isVideoEnabled ? 'Disable Video' : 'Enable Video'}
    </button>

    {/* Button for initiating the call */}
    <button onClick={sendOffer} disabled={isCalling}>
      {isCalling ? 'Calling...' : 'Call'}
    </button>

    {/* Your WebRTC video call UI */}
    <button onClick={sendOffer}>Send Offer</button>

    {/* Button for accepting the call */}
    <button onClick={() => handleCallAcceptance(offerData)}>Accept Call</button>

    </div>
  );
};

export default WebRTCVideoCall;
