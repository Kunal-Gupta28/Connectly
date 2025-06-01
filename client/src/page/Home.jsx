import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  AppBar,
  Toolbar,
  Avatar,
  Tooltip,
  Badge,
  Divider,
  Container,
  Grid,
  TextField,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  VideoCall as VideoCallIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  ExitToApp as ExitToAppIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  History as HistoryIcon,
  Schedule as ScheduleIcon,
  AccountCircle as AccountCircleIcon,
  Security as SecurityIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import TrackingBall from '../component/TrackingBall';
import {
  AnimatedGrid,
  AnimatedCard,
  GlowingButton,
} from '../component/HomeAnimations';
import { v4 as uuidv4 } from 'uuid';
import {useSocket} from '../context/socketContext'
import { toast } from 'react-toastify';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
    },
  },
  tap: {
    scale: 0.95,
  },
};

const glassCard = {
  background: 'rgba(17, 24, 39, 0.8)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(99, 102, 241, 0.3)',
  borderRadius: '24px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(99, 102, 241, 0.4)',
  },
};

const gradientText = {
  background: 'linear-gradient(45deg, #FFFFFF, #E0E7FF)',
  backgroundClip: 'text',
  textFillColor: 'transparent',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const gradientButton = {
  background: 'linear-gradient(45deg, #6366F1, #818CF8)',
  color: 'white',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #4F46E5, #6366F1)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)',
  },
};

export default function Home() {
  const navigate = useNavigate();
  const {socket,isConnected} = useSocket();
  const [isMicOn, setIsMicOn] = React.useState(false);
  const [isVideoOn, setIsVideoOn] = React.useState(false);
  const [localStream, setLocalStream] = React.useState(null);
  const [showControls, setShowControls] = React.useState(true);
  const [roomId, setRoomId] = React.useState('');
  const [showJoinDialog, setShowJoinDialog] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const videoRef = React.useRef(null);


  // open profile menu 
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // close profile menu
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  // profile navigate
  const handleProfileClick = () => {
    handleProfileMenuClose();
    navigate('/profile');
  };

  // logout 
  const handleLogout = () => {
    handleProfileMenuClose();
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Handle video toggle
  const handleVideoToggle = async () => {
    if(!isVideoOn){
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video:true})
        setLocalStream(stream)

        setIsVideoOn(true);
      } catch (error) {
          toast.error(`failed to access camera ${error}`)
          console.error(error)
      }
    }else{
      if (localStream) {
        localStream.getTracks().forEach(track => {
          track.stop();
        });
      setLocalStream(null);
    }
    setIsVideoOn(false);
    }
  };

  // Update video element when stream changes
  React.useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [localStream]);

  // create room
  const handleCreateRoom = async ()=>{
    if(isConnected){
      const id = uuidv4();
      setRoomId(id) 
      socket.emit("create-room",{roomId:id})

      socket.on("navigate_host",({joinHostToRoomId})=>{
        navigate(`/room/${joinHostToRoomId}`)
      })
    }
  }

  // join room
  const handleJoinRoom = () => {
    if (isConnected) {
      socket.emit("join-room",roomId)
      socket.on("join_the_user",({joinNewUser})=>{
        navigate(`/room/${joinNewUser}`);
      })
      
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100dvh', 
      bgcolor: '#111827',
      background: 'linear-gradient(135deg, #111827 0%, #1E293B 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* tracking ball */}
      <TrackingBall />
      <AnimatedGrid />

      {/* navbar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          background: 'rgba(26, 26, 46, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(107, 70, 193, 0.3)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Toolbar>

          {/* logo and branding */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              ...gradientText,
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontSize: { xs: '1.2rem', sm: '1.5rem' },
            }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >

              <VideoCallIcon sx={{ fontSize: 28 }} />
            </motion.div>
            Connectly
          </Typography>

          {/* badge and profile icon */}
          <Box sx={{ display: 'flex', gap: 1 }}>

            {/* badge icon */}
            <Tooltip title="Notifications">
              <IconButton 
                color="inherit"
                sx={{
                  '&:hover': {
                    background: 'rgba(107, 70, 193, 0.1)',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* profile icon */}
            <Tooltip title="Profile">
              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{
                  '&:hover': {
                    background: 'rgba(107, 70, 193, 0.1)',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'rgba(107, 70, 193, 0.8)',
                  }}
                >
                  JD
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(17, 24, 39, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(107, 70, 193, 0.3)',
            mt: 1.5,
            minWidth: 220,
            '& .MuiMenuItem-root': {
              py: 1.5,
              px: 2,
              '&:hover': {
                bgcolor: 'rgba(107, 70, 193, 0.1)',
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Typography variant="subtitle2" color="rgba(255, 255, 255, 0.7)">
            Signed in as
          </Typography>
          <Typography variant="body2" color="white" sx={{ fontWeight: 'bold' }}>
            john.doe@example.com
          </Typography>
        </Box>
        
        <MenuItem onClick={handleProfileClick} sx={{ color: 'white' }}>
          <AccountCircleIcon sx={{ mr: 1.5, color: 'rgba(107, 70, 193, 0.8)' }} /> 
          Profile
        </MenuItem>
        
        <MenuItem onClick={handleProfileMenuClose} sx={{ color: 'white' }}>
          <SettingsIcon sx={{ mr: 1.5, color: 'rgba(107, 70, 193, 0.8)' }} /> 
          Settings
        </MenuItem>
        
        <MenuItem onClick={handleProfileMenuClose} sx={{ color: 'white' }}>
          <SecurityIcon sx={{ mr: 1.5, color: 'rgba(107, 70, 193, 0.8)' }} /> 
          Security
        </MenuItem>
        
        <MenuItem onClick={handleProfileMenuClose} sx={{ color: 'white' }}>
          <HelpIcon sx={{ mr: 1.5, color: 'rgba(107, 70, 193, 0.8)' }} /> 
          Help & Support
        </MenuItem>
        
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 1 }} />
        
        <MenuItem onClick={handleLogout} sx={{ color: 'white' }}>
          <ExitToAppIcon sx={{ mr: 1.5, color: 'rgba(239, 68, 68, 0.8)' }} /> 
          Logout
        </MenuItem>
      </Menu>

      {/* main */}
      <Container maxWidth="lg" sx={{ pt: 10, pb: 4 }}>
        <Grid container spacing={4}>

          {/* video preview  and start or join meeting */}
          <Grid item xs={12} md={8}>
            <Box
              component={motion.div}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}
            >

              {/* video preview and user id  */}
              <AnimatedCard>
              <Paper
                component={motion.div}
                variants={itemVariants}
                sx={{
                  ...glassCard,
                  p: 4,
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={() => setShowControls(true)}
                onMouseLeave={() => setShowControls(false)}
              >

                {/* video preview */}
                <Box
                  sx={{
                    aspectRatio: '16/9',
                    bgcolor: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid rgba(107, 70, 193, 0.3)',
                    width: '100%',
                    height: '100%',
                    maxHeight: '500px',
                  }}
                >
                  {isVideoOn ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        transform: 'scaleX(-1)',
                      }}
                    />
                  ) : (
                    <Typography variant="h6" color="rgba(255, 255, 255, 0.7)">
                      Your video will appear here
                    </Typography>
                  )}

                  {/* mic and video control buttons */}
                  <AnimatePresence>
                    {showControls && (
                      <Box
                        component={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          p: 2,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                          display: 'flex',
                          justifyContent: 'center',
                          gap: 2,
                        }}
                      >

                        {/* mic button */}
                        <Tooltip title={isMicOn ? 'Mute' : 'Unmute'}>
                          <IconButton
                            onClick={() =>{setIsMicOn(!isMicOn)}}
                            sx={{
                              bgcolor: isMicOn ? 'rgba(107, 70, 193, 0.8)' : 'rgba(239, 68, 68, 0.8)',
                              '&:hover': {
                                bgcolor: isMicOn ? 'rgba(107, 70, 193, 0.9)' : 'rgba(239, 68, 68, 0.9)',
                                transform: 'scale(1.1)',
                              },
                              transition: 'all 0.3s ease',
                            }}
                          >
                            {isMicOn ? <MicIcon /> : <MicOffIcon />}
                          </IconButton>
                        </Tooltip>

                        {/* video button */}
                        <Tooltip title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}>
                          <IconButton
                            onClick={handleVideoToggle}
                            sx={{
                              bgcolor: isVideoOn ? 'rgba(107, 70, 193, 0.8)' : 'rgba(239, 68, 68, 0.8)',
                              '&:hover': {
                                bgcolor: isVideoOn ? 'rgba(107, 70, 193, 0.9)' : 'rgba(239, 68, 68, 0.9)',
                                transform: 'scale(1.1)',
                              },
                              transition: 'all 0.3s ease',
                            }}
                          >
                            {isVideoOn ? <VideocamIcon /> : <VideocamOffIcon />}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </AnimatePresence>
                </Box>

                {/* user details */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: 'rgba(107, 70, 193, 0.8)',
                      boxShadow: '0 4px 12px rgba(107, 70, 193, 0.3)',
                    }}
                  >
                    JD
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" color="white">
                      John Doe
                    </Typography>
                    <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                      Connectly Meeting Host
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                {/* invite and meeting id */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >

                  {/* invite button */}
                  <Button
                    variant="outlined"
                    startIcon={<PeopleIcon />}
                    component={motion.button}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    sx={{
                      borderColor: 'rgba(107, 70, 193, 0.5)',
                      marginRight: 6,
                      color: 'white',
                      '&:hover': {
                        borderColor: 'rgba(107, 70, 193, 0.8)',
                        background: 'rgba(107, 70, 193, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Invite to Connectly
                  </Button>

                  {/* meeting id */}
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                    Connectly Meeting ID: 123-456-789
                  </Typography>
                </Box>
              </Paper>
              </AnimatedCard>

              {/* start or join meeting */}
              <AnimatedCard>
              <Paper
                component={motion.div}
                variants={itemVariants}
                sx={{
                  ...glassCard,
                  p: 3,
                }}
              >
                <Typography variant="h6" gutterBottom color="white">
                  Start or Join a Meeting
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <GlowingButton onClick={() => handleCreateRoom()}>

                  {/* new connectly meeting button */}
                  <Button
                    variant="contained"
                    startIcon={<VideoCallIcon />}
                    fullWidth
                    sx={{
                      ...gradientButton,
                      py: 1.5,
                    }}
                  >
                    New Connectly Meeting
                  </Button>
                    </GlowingButton>

                    {/* join meeting button */}
                    <GlowingButton onClick={() => setShowJoinDialog(true)}>
                  <Button
                    variant="outlined"
                    startIcon={<PeopleIcon />}
                    fullWidth
                    sx={{
                      borderColor: 'rgba(107, 70, 193, 0.5)',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'rgba(107, 70, 193, 0.8)',
                        background: 'rgba(107, 70, 193, 0.1)',
                      },
                    }}
                  >
                    Join Meeting
                  </Button>
                    </GlowingButton>
                </Box>
              </Paper>
              </AnimatedCard>
            </Box>
          </Grid>

          {/* Upcoming and recent meetings */}
          <Grid item xs={12} md={4}>
            <Box
              component={motion.div}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}
            >

              {/* Upcoming Meetings */}
              <AnimatedCard>
              <Paper
                component={motion.div}
                variants={itemVariants}
                sx={{
                  ...glassCard,
                  p: 3,
                }}
              >
                <Typography variant="h6" gutterBottom color="white">
                  Upcoming Meetings
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <GlowingButton>
                  <Button
                    startIcon={<ScheduleIcon />}
                    sx={{
                      justifyContent: 'flex-start',
                      color: 'white',
                      '&:hover': {
                        background: 'rgba(107, 70, 193, 0.1)',
                      },
                    }}
                  >
                    Team Sync - 2:00 PM
                  </Button>
                    </GlowingButton>
                    <GlowingButton>
                  <Button
                    startIcon={<ScheduleIcon />}
                    sx={{
                      justifyContent: 'flex-start',
                      color: 'white',
                      '&:hover': {
                        background: 'rgba(107, 70, 193, 0.1)',
                      },
                    }}
                  >
                    Project Review - 4:30 PM
                  </Button>
                    </GlowingButton>
                </Box>
              </Paper>
              </AnimatedCard>

              {/* Recent Meetings */}
              <AnimatedCard>
              <Paper
                component={motion.div}
                variants={itemVariants}
                sx={{
                  ...glassCard,
                  p: 3,
                }}
              >
                <Typography variant="h6" gutterBottom color="white">
                  Recent Meetings
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <GlowingButton>
                  <Button
                    startIcon={<HistoryIcon />}
                    sx={{
                      justifyContent: 'flex-start',
                      color: 'white',
                      '&:hover': {
                        background: 'rgba(107, 70, 193, 0.1)',
                      },
                    }}
                  >
                    Client Call - Yesterday
                  </Button>
                    </GlowingButton>
                    <GlowingButton>
                  <Button
                    startIcon={<HistoryIcon />}
                    sx={{
                      justifyContent: 'flex-start',
                      color: 'white',
                      '&:hover': {
                        background: 'rgba(107, 70, 193, 0.1)',
                      },
                    }}
                  >
                    Team Standup - 2 days ago
                  </Button>
                    </GlowingButton>
                </Box>
              </Paper>
              </AnimatedCard>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* join dialog */}
      <AnimatePresence>
        {showJoinDialog && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
            onClick={() => setShowJoinDialog(false)}
          >
            <Paper
              component={motion.div}
              sx={{
                ...glassCard,
                p: 4,
                maxWidth: 400,
                width: '90%',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Typography variant="h6" gutterBottom color="white">
                Join a Meeting
              </Typography>

              {/* text area */}
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter Meeting ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(107, 70, 193, 0.5)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(107, 70, 193, 0.8)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(107, 70, 193, 1)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              />

              {/* action buttons */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>

                {/* cancel button */}
                <Button
                  variant="outlined"
                  onClick={() => setShowJoinDialog(false)}
                  sx={{
                    borderColor: 'rgba(107, 70, 193, 0.5)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'rgba(107, 70, 193, 0.8)',
                      background: 'rgba(107, 70, 193, 0.1)',
                    },
                  }}
                >
                  Cancel
                </Button>

                {/* join button */}
                <Button
                  variant="contained"
                  onClick={handleJoinRoom}
                  disabled={!roomId.trim()}
                  sx={{
                    ...gradientButton,
                  }}
                >
                  Join
                </Button>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
