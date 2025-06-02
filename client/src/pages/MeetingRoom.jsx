import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  Grid,
  Avatar,
  Tooltip,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  Fade,
  Zoom,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  ScreenShare as ScreenShareIcon,
  Chat as ChatIcon,
  Forum as ForumIcon,
  Message as MessageIcon,
  People as PeopleIcon,
  MoreVert as MoreVertIcon,
  CallEnd as CallEndIcon,
  Close as CloseIcon,
  RecordVoiceOver as RecordIcon,
  PanTool as HandIcon,
  Settings as SettingsIcon,
  ContentCopy as CopyIcon,
  Timer as TimerIcon,
  ViewModule as GridIcon,
  ViewStream as SpeakerIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  PictureInPicture as PipIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import Chat from '../components/Chat';
import TrackingBall from '../components/TrackingBall';
import { useSocket } from '../contexts/socketContext'
import { toast } from 'react-toastify';

const glassCard = {
  background: 'rgba(17, 24, 39, 0.85)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(99, 102, 241, 0.3)',
  borderRadius: '24px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  transition: 'all 0.3s ease',
};

const gradientText = {
  background: 'linear-gradient(45deg, #FFFFFF, #E0E7FF)',
  backgroundClip: 'text',
  textFillColor: 'transparent',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 600,
};

const itemVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const panelVariants = {
  hidden: { 
    x: 100,
    opacity: 0,
    scale: 0.95
  },
  visible: { 
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: {
    x: 100,
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1]
    }
  }
};

const MeetingRoom = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { socket, isConnected } = useSocket()
  const videoRef = useRef(null);

  // state
  // bottom icon buttons
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isPip, setIsPip] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // media stream state
  const [mediaStream, setMediaStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);




  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [meetingDuration, setMeetingDuration] = useState(0);
  const [layout, setLayout] = useState('grid');
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [participants, setParticipants] = useState([
    { id: 1, name: 'John Doe', isHost: true, isMuted: false },
    // { id: 2, name: 'Jane Smith', isHost: false, isMuted: true },
    // { id: 3, name: 'Mike Johnson', isHost: false, isMuted: false },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [activePersonalChat, setActivePersonalChat] = useState(null);
  const [chatType, setChatType] = useState('group');
  




  // socket 
  useEffect(() => {
    const peerConnections = {}; // key: socket.id
  
    const createPeerConnection = (socketId) => {
      if (peerConnections[socketId]) return peerConnections[socketId];
    
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });
    
      // Add all tracks from mediaStream to this connection
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => {
          pc.addTrack(track, mediaStream);
        });
      }
    
      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', { candidate: event.candidate, to: socketId });
        }
      };
    
      // Handle incoming remote stream tracks
      pc.ontrack = (event) => {
        // You can display remote streams here
        const remoteVideo = document.getElementById(`remoteVideo_${socketId}`);
        if (remoteVideo) {
          remoteVideo.srcObject = event.streams[0];
        } else {
          // create video element or handle new remote stream
        }
      };
    
      peerConnections[socketId] = pc;
      return pc;
    };
    
  
    const createOffer = async (socketId) => {
      const pc = createPeerConnection(socketId);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      return { offer, pc };
    };
  
    const createAnswer = async (offer, socketId) => {
      const pc = createPeerConnection(socketId);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      return { answer, pc };
    };
  
    if (isConnected) {
      socket.on("new-user-connected", async ({ newlyJoinUser }) => {
        toast.info(`${newlyJoinUser} joined the meeting`);
        const { offer } = await createOffer(newlyJoinUser);
        socket.emit("send-offer", { offer, newlyJoinUser });
      });
  
      socket.on("receive-offer", async ({ offer, alreadyJoinedUser }) => {
        console.log("Received offer from", alreadyJoinedUser);
        const { answer } = await createAnswer(offer, alreadyJoinedUser);
        socket.emit("send-answer", { answer, alreadyJoinedUser });
      });
  
      socket.on("receive-answer", async ({ answer, newlyJoinUser }) => {
        console.log("Received answer from", newlyJoinUser);
        const pc = peerConnections[newlyJoinUser];
        if (pc) {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        }
      });

        // ✅ New: Participant count update
      socket.on("participant-count", ({ count }) => {
        setParticipants(count);
      });
      
      return () => {
        socket.off("new-user-connected");
        socket.off("receive-offer");
        socket.off("receive-answer");
      };
    }
  }, [socket, isConnected]);
  
  

  // Media stream management
  useEffect(() => {
    let stream = null;

    const initializeMedia = async () => {
      try {
        // Stop existing stream if any
        if (mediaStream) {
          mediaStream.getTracks().forEach(track => track.stop());
        }

        // Get new stream only if either video or audio is enabled
        if (isVideoOn || isMicOn) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: isVideoOn,
            audio: isMicOn,
          });
          setMediaStream(stream);
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } else {
          setMediaStream(null);
          if (videoRef.current) {
            videoRef.current.srcObject = null;
          }
        }
      } catch (err) {
        console.error('Media error:', err);
        toast.error('Failed to access camera and microphone. Please check your permissions.');
        // Reset states if permission denied
        setIsVideoOn(false);
        setIsMicOn(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeMedia();

    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isVideoOn, isMicOn]);

  // timmer
  useEffect(() => {
    const timer = setInterval(() => {
      setMeetingDuration(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      setIsMicOn(false);
      setIsVideoOn(false);
      setIsScreenSharing(false);
      setIsRecording(false);
    };
  }, []);

  // timer
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // copy meeting id
  const copyMeetingId = () => {
    navigator.clipboard.writeText(id);
    setShowCopyAlert(true);
    toast.success("Meeting ID copied to clipboard!");
  };

  // Video toggle with proper stream handling
  const handleToggleVideo = async () => {
    try {
      if (isVideoOn) {
        // Turning off video
        if (mediaStream) {
          const videoTrack = mediaStream.getVideoTracks()[0];
          if (videoTrack) {
            videoTrack.stop();
          }
        }
        setIsVideoOn(false);
      } else {
        // Turning on video
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true,
          audio: isMicOn 
        });
        setMediaStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsVideoOn(true);
      }
    } catch (err) {
      console.error('Video toggle error:', err);
      toast.error("Could not toggle camera. Please check permissions.");
      setIsVideoOn(false);
    }
  };

  // Mic toggle with proper stream handling
  const handleToggleMic = async () => {
    try {
      if (isMicOn) {
        // Turning off mic
        if (mediaStream) {
          const audioTrack = mediaStream.getAudioTracks()[0];
          if (audioTrack) {
            audioTrack.stop();
          }
        }
        setIsMicOn(false);
      } else {
        // Turning on mic
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: isVideoOn,
          audio: true 
        });
        setMediaStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsMicOn(true);
      }
    } catch (err) {
      console.error('Mic toggle error:', err);
      toast.error("Could not toggle microphone. Please check permissions.");
      setIsMicOn(false);
    }
  };

  const handleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setScreenStream(stream);
        setIsScreenSharing(true);
        toast.success("Screen sharing started");
      } else {
        if (screenStream) {
          screenStream.getTracks().forEach(track => track.stop());
          setScreenStream(null);
        }
        setIsScreenSharing(false);
        toast.info("Screen sharing stopped");
      }
    } catch (err) {
      console.error('Screen share error:', err);
      toast.error("Could not start screen sharing");
    }
  };

  const handleEndCall = () => {
    setShowLeaveDialog(true);
  };

  // end meeting
  const confirmEndCall = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
    }
    toast.info("Leaving meeting...");
    navigate('/home');
  };

  const handleSettingsClick = (event) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchorEl(null);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const togglePip = async () => {
    if (!isPip) {
      try {
        const video = document.querySelector('video');
        if (video) {
          await video.requestPictureInPicture();
          setIsPip(true);
        }
      } catch (err) {
        console.error('Failed to enter PiP mode:', err);
      }
    } else {
      try {
        await document.exitPictureInPicture();
        setIsPip(false);
      } catch (err) {
        console.error('Failed to exit PiP mode:', err);
      }
    }
  };

  const handlePersonalChat = (participant) => {
    setActivePersonalChat(participant);
    setChatType('personal');
    setIsChatOpen(true);
  };

  const handleGroupChat = () => {
    setActivePersonalChat(null);
    setChatType('group');
    setIsChatOpen(true);
  };

  return (
    <Box sx={{ 
      minHeight: '100dvh',
      bgcolor: '#111827',
      background: 'linear-gradient(135deg, #111827 0%, #1E293B 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* tracking ball animation */}
      <TrackingBall />

      {/* background concentric circles   */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />


      {/* nav bar */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
        background: 'rgba(17, 24, 39, 0.9)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* meeting id  */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ ...gradientText, fontWeight: 'bold' }}>
            Meeting ID: {id}
          </Typography>
          <Tooltip title="Copy Meeting ID">
            <IconButton
              onClick={copyMeetingId}
              sx={{
                color: 'white',
                '&:hover': {
                  background: 'rgba(99, 102, 241, 0.1)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <CopyIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* timer, participant, chat and setting */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            bgcolor: 'rgba(99, 102, 241, 0.1)',
            px: 2,
            py: 1,
            borderRadius: 2,
          }}>
            <TimerIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
            <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
              {formatDuration(meetingDuration)}
            </Typography>
          </Box>

          {/* participants and chat  */}
          <Box sx={{ display: 'flex', gap: 1 }}>
          
          {/* participants */}
            <Tooltip title="Participants">
              <IconButton
                onClick={() => setIsParticipantsOpen(!isParticipantsOpen)}
                sx={{
                  color: 'white',
                  '&:hover': {
                    background: 'rgba(99, 102, 241, 0.1)',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Badge badgeContent={participants.length} color="error">
                  <PeopleIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* chat */}
            <Tooltip title="Chat">
              <IconButton
                onClick={() => setIsChatOpen(!isChatOpen)}
                sx={{
                  color: 'white',
                  '&:hover': {
                    background: 'rgba(99, 102, 241, 0.1)',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Badge badgeContent={2} color="error">
                  <ChatIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* setting */}
            <Tooltip title="Settings">
              <IconButton
                onClick={handleSettingsClick}
                sx={{
                  color: 'white',
                  '&:hover': {
                    background: 'rgba(99, 102, 241, 0.1)',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      {/* videos and chat container  */}
      <Grid container spacing={2} sx={{ 
        p: 2, 
        height: '90dvh',
        maxWidth: '100%',
        margin: 0,
        position: 'relative'
      }}>

        {/* videos container */}
        <Grid item xs={12} sx={{ 
          position: 'relative',
          transition: 'all 0.3s ease-in-out',
          width: isChatOpen || isParticipantsOpen ? '70%' : '100%',
          height: '100%'
        }}>
          <Paper
            component={motion.div}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            sx={{
              ...glassCard,
              p: 2,
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {isLoading ? (
              <Box sx={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <CircularProgress sx={{ color: 'rgba(99, 102, 241, 0.8)' }} />
              </Box>
            ) : (
              <>
                <Box
                  sx={{
                    flex: 1,
                    display: 'grid',
                    gridTemplateColumns: layout === 'grid' 
                      ? 'repeat(auto-fit, minmax(320px, 1fr))'
                      : '1fr',
                    gap: 2,
                    p: 2,
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                      width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'rgba(99, 102, 241, 0.5)',
                      borderRadius: '4px',
                      '&:hover': {
                        background: 'rgba(99, 102, 241, 0.7)',
                      },
                    },
                  }}
                >
                  {participants.map((participant, index) => (
                    <Paper
                      key={participant.id}
                      sx={{
                        ...glassCard,
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        aspectRatio: layout === 'grid' ? '16/9' : '21/9',
                        position: 'relative',
                        transform: layout === 'grid' ? 'none' : index === 0 ? 'scale(1.1)' : 'scale(0.9)',
                        transition: 'all 0.3s ease',
                        overflow: 'hidden'
                      }}
                    >
                      {index === 0 && (
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '16px',
                          }}
                        />
                      )}
                      {!isVideoOn && (
                        <Avatar
                          sx={{
                            width: layout === 'grid' ? 80 : 120,
                            height: layout === 'grid' ? 80 : 120,
                            bgcolor: 'rgba(99, 102, 241, 0.8)',
                            mb: 2,
                          }}
                        >
                          {participant.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                      )}
                      <Typography variant="subtitle1" color="white">
                        {participant.name}
                      </Typography>
                      {participant.isHost && (
                        <Typography variant="caption" color="rgba(255, 255, 255, 0.7)">
                          Host
                        </Typography>
                      )}
                      {isHandRaised && index === 0 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'rgba(99, 102, 241, 0.8)',
                            borderRadius: '50%',
                            p: 1,
                          }}
                        >
                          <HandIcon sx={{ color: 'white' }} />
                        </Box>
                      )}
                    </Paper>
                  ))}
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 2,
                    p: 2,
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(17, 24, 39, 0.8)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <Tooltip title={isMicOn ? 'Mute' : 'Unmute'}>
                    <IconButton
                      onClick={handleToggleMic}
                      sx={{
                        bgcolor: isMicOn ? 'rgba(99, 102, 241, 0.8)' : 'rgba(239, 68, 68, 0.8)',
                        '&:hover': {
                          bgcolor: isMicOn ? 'rgba(99, 102, 241, 0.9)' : 'rgba(239, 68, 68, 0.9)',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {isMicOn ? <MicIcon /> : <MicOffIcon />}
                    </IconButton>
                  </Tooltip>

                  {/* camera button */}
                  <Tooltip title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}>
                    <IconButton
                      onClick={handleToggleVideo}
                      sx={{
                        bgcolor: isVideoOn ? 'rgba(99, 102, 241, 0.8)' : 'rgba(239, 68, 68, 0.8)',
                        '&:hover': {
                          bgcolor: isVideoOn ? 'rgba(99, 102, 241, 0.9)' : 'rgba(239, 68, 68, 0.9)',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {isVideoOn ? <VideocamIcon /> : <VideocamOffIcon />}
                    </IconButton>
                  </Tooltip>

                  {/* screen share button */}
                  <Tooltip title={isScreenSharing ? 'Stop sharing' : 'Share screen'}>
                    <IconButton
                      onClick={handleScreenShare}
                      sx={{
                        bgcolor: isScreenSharing ? 'rgba(99, 102, 241, 0.8)' : 'rgba(99, 102, 241, 0.5)',
                        '&:hover': {
                          bgcolor: 'rgba(99, 102, 241, 0.9)',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <ScreenShareIcon />
                    </IconButton>
                  </Tooltip>

                  {/* recording button */}
                  <Tooltip title={isRecording ? 'Stop recording' : 'Start recording'}>
                    <IconButton
                      onClick={() => setIsRecording(!isRecording)}
                      sx={{
                        bgcolor: isRecording ? 'rgba(239, 68, 68, 0.8)' : 'rgba(99, 102, 241, 0.5)',
                        '&:hover': {
                          bgcolor: isRecording ? 'rgba(239, 68, 68, 0.9)' : 'rgba(99, 102, 241, 0.9)',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <RecordIcon />
                    </IconButton>
                  </Tooltip>

                  {/* raise hand button */}
                  <Tooltip title={isHandRaised ? 'Lower hand' : 'Raise hand'}>
                    <IconButton
                      onClick={() => setIsHandRaised(!isHandRaised)}
                      sx={{
                        bgcolor: isHandRaised ? 'rgba(99, 102, 241, 0.8)' : 'rgba(99, 102, 241, 0.5)',
                        '&:hover': {
                          bgcolor: 'rgba(99, 102, 241, 0.9)',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <HandIcon />
                    </IconButton>
                  </Tooltip>

                  {/* pip button */}
                  <Tooltip title={isPip ? 'Exit Picture-in-Picture' : 'Enter Picture-in-Picture'}>
                    <IconButton
                      onClick={togglePip}
                      sx={{
                        bgcolor: isPip ? 'rgba(99, 102, 241, 0.8)' : 'rgba(99, 102, 241, 0.5)',
                        '&:hover': {
                          bgcolor: 'rgba(99, 102, 241, 0.9)',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <PipIcon />
                    </IconButton>
                  </Tooltip>

                  {/* fullscreen button */}
                  <Tooltip title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
                    <IconButton
                      onClick={toggleFullscreen}
                      sx={{
                        bgcolor: isFullscreen ? 'rgba(99, 102, 241, 0.8)' : 'rgba(99, 102, 241, 0.5)',
                        '&:hover': {
                          bgcolor: 'rgba(99, 102, 241, 0.9)',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                    </IconButton>
                  </Tooltip>

                  {/* end call button */}
                  <Button
                    variant="contained"
                    startIcon={<CallEndIcon />}
                    onClick={handleEndCall}
                    sx={{
                      background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
                        transform: 'scale(1.05)',
                        boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    End Call
                  </Button>
                </Box>
              </>
            )}
          </Paper>
        </Grid>

        {/* chat and participant */}
        <AnimatePresence mode="wait">
          {(isChatOpen || isParticipantsOpen) && (
            <Grid item xs={12} sx={{ 
              position: 'absolute',
              right: 0,
              top: 0,
              height: '90dvh',
              width: '27vw',
              transition: 'all 0.3s ease-in-out',
              zIndex: 1
            }}>
              {isChatOpen ? (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={panelVariants}
                  style={{ height: '100%' }}
                >
                  <Chat 
                    onClose={() => {
                      setIsChatOpen(false);
                      setActivePersonalChat(null);
                      setChatType('group');
                    }}
                    participants={participants}
                    activePersonalChat={activePersonalChat}
                    chatType={chatType}
                  />
                </motion.div>
              ) : (
                <Paper
                  component={motion.div}
                  variants={panelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  sx={{
                    ...glassCard,
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                  }}
                >
                  <Box sx={{ 
                    p: 2, 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(17, 24, 39, 0.8)',
                    backdropFilter: 'blur(20px)',
                  }}>
                    <Typography variant="h6" color="white">
                      Participants
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Group Chat">
                        <IconButton
                          onClick={handleGroupChat}
                          sx={{
                            color: 'white',
                            '&:hover': {
                              background: 'rgba(99, 102, 241, 0.1)',
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <ChatIcon />
                        </IconButton>
                      </Tooltip>
                      <IconButton
                        onClick={() => setIsParticipantsOpen(false)}
                        sx={{
                          color: 'white',
                          '&:hover': {
                            background: 'rgba(99, 102, 241, 0.1)',
                            transform: 'scale(1.1)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <List sx={{ 
                    flex: 1, 
                    overflow: 'auto', 
                    p: 2,
                    '&::-webkit-scrollbar': {
                      width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'rgba(99, 102, 241, 0.5)',
                      borderRadius: '4px',
                      '&:hover': {
                        background: 'rgba(99, 102, 241, 0.7)',
                      },
                    },
                  }}>
                    {participants.map((participant) => (
                      <ListItem 
                        key={participant.id}
                        sx={{
                          mb: 1,
                          bgcolor: 'rgba(99, 102, 241, 0.1)',
                          borderRadius: 2,
                          '&:hover': {
                            bgcolor: 'rgba(99, 102, 241, 0.2)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'rgba(99, 102, 241, 0.8)' }}>
                            {participant.name.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={participant.name}
                          secondary={participant.isHost ? 'Host' : 'Participant'}
                          primaryTypographyProps={{ color: 'white' }}
                          secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.7)' }}
                        />
                        <ListItemSecondaryAction sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Message">
                            <IconButton
                              edge="end"
                              onClick={() => handlePersonalChat(participant)}
                              sx={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                '&:hover': {
                                  color: 'white',
                                  transform: 'scale(1.1)',
                                },
                                transition: 'all 0.3s ease',
                              }}
                            >
                              <MessageIcon />
                            </IconButton>
                          </Tooltip>
                          <IconButton
                            edge="end"
                            sx={{
                              color: participant.isMuted ? 'rgba(239, 68, 68, 0.8)' : 'rgba(255, 255, 255, 0.7)',
                            }}
                          >
                            {participant.isMuted ? <MicOffIcon /> : <MicIcon />}
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
            </Grid>
          )}
        </AnimatePresence>
      </Grid>

      {/* setting  */}
      <Menu
        anchorEl={settingsAnchorEl}
        open={Boolean(settingsAnchorEl)}
        onClose={handleSettingsClose}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(17, 24, 39, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
          },
        }}
      >
        <MenuItem onClick={() => { setLayout('grid'); handleSettingsClose(); }} sx={{ color: 'white' }}>
          <GridIcon sx={{ mr: 1 }} /> Grid View
        </MenuItem>
        <MenuItem onClick={() => { setLayout('speaker'); handleSettingsClose(); }} sx={{ color: 'white' }}>
          <SpeakerIcon sx={{ mr: 1 }} /> Speaker View
        </MenuItem>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        <MenuItem onClick={toggleFullscreen} sx={{ color: 'white' }}>
          {isFullscreen ? (
            <>
              <FullscreenExitIcon sx={{ mr: 1 }} /> Exit Fullscreen
            </>
          ) : (
            <>
              <FullscreenIcon sx={{ mr: 1 }} /> Enter Fullscreen
            </>
          )}
        </MenuItem>
        <MenuItem onClick={togglePip} sx={{ color: 'white' }}>
          {isPip ? (
            <>
              <PipIcon sx={{ mr: 1 }} /> Exit Picture-in-Picture
            </>
          ) : (
            <>
              <PipIcon sx={{ mr: 1 }} /> Enter Picture-in-Picture
            </>
          )}
        </MenuItem>
      </Menu>

      {/* notification for copying meeting id */}
      <Snackbar
        open={showCopyAlert}
        autoHideDuration={1000}
        onClose={() => setShowCopyAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowCopyAlert(false)} 
          severity="success" 
          sx={{ 
            width: '100%',
            bgcolor: 'rgba(99, 102, 241, 0.9)',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white',
            },
          }}
        >
          Meeting ID copied to clipboard!
        </Alert>
      </Snackbar>

      {/* leave meeting popup */}
      <Dialog
        open={showLeaveDialog}
        onClose={() => setShowLeaveDialog(false)}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(17, 24, 39, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
          },
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>Leave Meeting?</DialogTitle>
        <DialogContent>
          <Typography color="rgba(255, 255, 255, 0.7)">
            Are you sure you want to leave the meeting? This will end your video and audio.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowLeaveDialog(false)}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmEndCall}
            variant="contained"
            sx={{
              bgcolor: 'rgba(239, 68, 68, 0.8)',
              '&:hover': {
                bgcolor: 'rgba(239, 68, 68, 0.9)',
              },
            }}
          >
            Leave
          </Button>
        </DialogActions>
      </Dialog>

      {/* error */}
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError(null)} 
          severity="error"
          sx={{ 
            width: '100%',
            bgcolor: 'rgba(239, 68, 68, 0.9)',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white',
            },
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MeetingRoom;
