import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  IconButton,
  Avatar,
  Divider,
  Paper,
  Tooltip,
  Badge,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
  LinearProgress,
  Popover,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
  MoreVert as MoreVertIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Reply as ReplyIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Error as ErrorIcon,
  Image as ImageIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker from 'emoji-picker-react';
import ReactEmoji from 'react-emoji';

const glassCard = {
  background: 'rgba(17, 24, 39, 0.85)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(99, 102, 241, 0.3)',
  borderRadius: '24px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  transition: 'all 0.3s ease',
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

const messageVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1]
    }
  },
};

const MessageStatus = ({ status }) => {
  switch (status) {
    case 'sending':
      return <ScheduleIcon sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.5)' }} />;
    case 'sent':
      return <CheckCircleIcon sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.5)' }} />;
    case 'error':
      return <ErrorIcon sx={{ fontSize: 16, color: 'rgba(239, 68, 68, 0.8)' }} />;
    default:
      return null;
  }
};

export default function Chat({ onClose, participants }) {
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { 
      id: 1, 
      user: 'John Doe', 
      message: 'Hello everyone! 👋', 
      time: '2:30 PM', 
      isCurrentUser: false,
      status: 'sent',
      replyTo: null,
    },
    { 
      id: 2, 
      user: 'You', 
      message: 'Hi John! How are you doing?', 
      time: '2:31 PM', 
      isCurrentUser: true,
      status: 'read',
      replyTo: null,
    },
    { 
      id: 3, 
      user: 'Jane Smith', 
      message: 'Just joined the meeting! 🎉', 
      time: '2:32 PM', 
      isCurrentUser: false,
      status: 'sent',
      replyTo: null,
    },
  ]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryMessage, setRetryMessage] = useState(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(null);
  const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);
  const [attachmentMenuAnchorEl, setAttachmentMenuAnchorEl] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (chatMessage.trim()) {
      setIsLoading(true);
      setError(null);
      
      try {
        const newMessage = {
          id: Date.now(),
          user: 'You',
          message: chatMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isCurrentUser: true,
          status: 'sending',
          replyTo: replyTo,
        };
        
        setChatMessages([...chatMessages, newMessage]);
        setChatMessage('');
        setUnreadCount(0);
        setReplyTo(null);
        setIsTyping(false);

        // Simulate message sending with socket.io
        // TODO: Replace with actual socket.io implementation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setChatMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, status: 'sent' }
              : msg
          )
        );
      } catch (err) {
        setError('Failed to send message. Please try again.');
        setRetryMessage(newMessage);
        setChatMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, status: 'error' }
              : msg
          )
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleMessageChange = (e) => {
    setChatMessage(e.target.value);
    setIsTyping(true);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Reset file input
    event.target.value = '';

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setError('File size should be less than 10MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only images (JPEG, PNG, GIF), PDF, and text files are allowed');
      return;
    }

    setIsLoading(true);
    setError(null);
    setFileUploadProgress(0);
    
    try {
      // Simulate file upload progress
      const progressInterval = setInterval(() => {
        setFileUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // TODO: Replace with actual file upload implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a preview URL for images
      let previewUrl = null;
      if (file.type.startsWith('image/')) {
        previewUrl = URL.createObjectURL(file);
      }

      const newMessage = {
        id: Date.now(),
        user: 'You',
        message: `📎 ${file.name}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCurrentUser: true,
        status: 'sent',
        replyTo: null,
        file: {
          name: file.name,
          size: file.size,
          type: file.type,
          url: previewUrl,
        },
      };
      
      setChatMessages([...chatMessages, newMessage]);
      setUnreadCount(0);
      setFileUploadProgress(100);

      // Clean up preview URL after 5 seconds
      if (previewUrl) {
        setTimeout(() => {
          URL.revokeObjectURL(previewUrl);
        }, 5000);
      }
    } catch (err) {
      setError('Failed to upload file. Please try again.');
      setFileUploadProgress(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageMenu = (event, message) => {
    setAnchorEl(event.currentTarget);
    setSelectedMessage(message);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMessage(null);
  };

  const handleReply = () => {
    setReplyTo(selectedMessage);
    handleMenuClose();
  };

  const handleEdit = () => {
    if (selectedMessage?.isCurrentUser) {
      setChatMessage(selectedMessage.message);
      handleMenuClose();
    }
  };

  const handleDelete = () => {
    if (selectedMessage?.isCurrentUser) {
      setChatMessages(prev => prev.filter(msg => msg.id !== selectedMessage.id));
      handleMenuClose();
    }
  };

  const handleRetryMessage = async () => {
    if (retryMessage) {
      setIsLoading(true);
      setError(null);
      
      try {
        // TODO: Replace with actual socket.io implementation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setChatMessages(prev => 
          prev.map(msg => 
            msg.id === retryMessage.id 
              ? { ...msg, status: 'sent' }
              : msg
          )
        );
        setRetryMessage(null);
      } catch (err) {
        setError('Failed to send message. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEmojiClick = (event) => {
    setEmojiAnchorEl(event.currentTarget);
  };

  const handleEmojiClose = () => {
    setEmojiAnchorEl(null);
  };

  const handleAttachmentClick = (event) => {
    setAttachmentMenuAnchorEl(event.currentTarget);
  };

  const handleAttachmentClose = () => {
    setAttachmentMenuAnchorEl(null);
  };

  const onEmojiClick = (emojiObject) => {
    setChatMessage(prev => prev + emojiObject.emoji);
    handleEmojiClose();
  };

  const handleFileSelect = (type) => {
    handleAttachmentClose();
    fileInputRef.current?.click();
  };

  return (
    <Paper
      component={motion.div}
      initial={{ x: 100, opacity: 0, scale: 0.95 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: 100, opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      sx={{
        ...glassCard,
        height: '90dvh',
        width: "27vw",
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), transparent)',
        },
      }}
    >
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'rgba(17, 24, 39, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '50%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), transparent)',
        },
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="h6" sx={{ 
            color: 'white',
            fontWeight: 600,
            background: 'linear-gradient(45deg, #FFFFFF, #E0E7FF)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.5px',
          }}>
            Chat
          </Typography>
          <Badge 
            badgeContent={unreadCount} 
            color="error"
            sx={{
              '& .MuiBadge-badge': {
                background: 'linear-gradient(45deg, #EF4444, #F87171)',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
                fontSize: '0.75rem',
                height: '20px',
                minWidth: '20px',
                padding: '0 6px',
              }
            }}
          >
            <Typography variant="caption" sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              background: 'rgba(99, 102, 241, 0.1)',
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.5px',
            }}>
              {participants.length} participants
            </Typography>
          </Badge>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'white',
            '&:hover': {
              background: 'rgba(99, 102, 241, 0.1)',
              transform: 'scale(1.1) rotate(90deg)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <CloseIcon />
        </IconButton>
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
        <AnimatePresence>
          {chatMessages.map((message) => (
            <motion.div
              key={message.id}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <ListItem
                sx={{
                  flexDirection: 'column',
                  alignItems: message.isCurrentUser ? 'flex-end' : 'flex-start',
                  mb: 2,
                }}
              >
                {message.replyTo && (
                  <Box
                    sx={{
                      width: '100%',
                      mb: 1,
                      p: 1.5,
                      bgcolor: 'rgba(99, 102, 241, 0.1)',
                      borderRadius: 2,
                      borderLeft: '3px solid rgba(99, 102, 241, 0.5)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Typography variant="caption" color="rgba(255, 255, 255, 0.7)" sx={{ fontWeight: 500 }}>
                      Replying to {message.replyTo.user}
                    </Typography>
                    <Typography variant="body2" color="rgba(255, 255, 255, 0.9)" sx={{ mt: 0.5 }}>
                      {message.replyTo.message}
                    </Typography>
                  </Box>
                )}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 0.5,
                    flexDirection: message.isCurrentUser ? 'row-reverse' : 'row',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      bgcolor: message.isCurrentUser ? 'rgba(99, 102, 241, 0.8)' : 'rgba(107, 70, 193, 0.8)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    {message.user[0]}
                  </Avatar>
                  <Typography variant="subtitle2" color="white" sx={{ fontWeight: 600 }}>
                    {message.user}
                  </Typography>
                  <Typography variant="caption" color="rgba(255, 255, 255, 0.5)" sx={{ fontSize: '0.75rem' }}>
                    {message.time}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMessageMenu(e, message)}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      '&:hover': {
                        color: 'white',
                        background: 'rgba(99, 102, 241, 0.1)',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    bgcolor: message.isCurrentUser ? 'rgba(99, 102, 241, 0.2)' : 'rgba(107, 70, 193, 0.2)',
                    borderRadius: 2,
                    p: 2,
                    maxWidth: '80%',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <Typography 
                    variant="body2" 
                    color="rgba(255, 255, 255, 0.9)"
                    sx={{
                      '& img.emoji': {
                        width: '1.2em',
                        height: '1.2em',
                        margin: '0 0.05em 0 0.1em',
                        verticalAlign: '-0.1em',
                      }
                    }}
                  >
                    {ReactEmoji.emojify(message.message)}
                  </Typography>
                  {message.isCurrentUser && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 4,
                        right: 8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <MessageStatus status={message.status} />
                    </Box>
                  )}
                  {message.file && (
                    <Box
                      sx={{
                        mt: 1,
                        p: 1.5,
                        bgcolor: 'rgba(99, 102, 241, 0.1)',
                        borderRadius: 1.5,
                        width: '100%',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'rgba(99, 102, 241, 0.2)',
                          transform: 'translateY(-1px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                      onClick={() => message.file.url && window.open(message.file.url, '_blank')}
                    >
                      {message.file.type.startsWith('image/') && message.file.url ? (
                        <Box sx={{ mb: 1 }}>
                          <img 
                            src={message.file.url} 
                            alt={message.file.name}
                            style={{
                              maxWidth: '100%',
                              maxHeight: '200px',
                              borderRadius: '12px',
                              objectFit: 'contain',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            }}
                          />
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <AttachFileIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                          <Box>
                            <Typography variant="body2" color="rgba(255, 255, 255, 0.9)" sx={{ fontWeight: 500 }}>
                              {message.file.name}
                            </Typography>
                            <Typography variant="caption" color="rgba(255, 255, 255, 0.7)" sx={{ fontSize: '0.75rem' }}>
                              {(message.file.size / 1024).toFixed(1)} KB
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              </ListItem>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
            <Typography variant="caption" color="rgba(255, 255, 255, 0.7)" sx={{ fontSize: '0.75rem' }}>
              Someone is typing...
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {[0, 1, 2].map((dot) => (
                <motion.div
                  key={dot}
                  animate={{
                    y: [0, -4, 0],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: dot * 0.2,
                  }}
                >
                  <Box
                    sx={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255, 255, 255, 0.7)',
                    }}
                  />
                </motion.div>
              ))}
            </Box>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </List>

      {replyTo && (
        <Box
          sx={{
            p: 1.5,
            bgcolor: 'rgba(99, 102, 241, 0.1)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="body2" color="rgba(255, 255, 255, 0.9)" sx={{ fontWeight: 500 }}>
            Replying to {replyTo.user}
          </Typography>
          <IconButton
            size="small"
            onClick={() => setReplyTo(null)}
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                color: 'white',
                background: 'rgba(99, 102, 241, 0.2)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid rgba(99, 102, 241, 0.2)',
        background: 'rgba(17, 24, 39, 0.9)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), transparent)',
        },
      }}>
        {fileUploadProgress !== null && (
          <Box sx={{ mb: 1.5 }}>
            <LinearProgress 
              variant="determinate" 
              value={fileUploadProgress}
              sx={{
                height: 4,
                borderRadius: 2,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: 'rgba(99, 102, 241, 0.8)',
                  boxShadow: '0 0 8px rgba(99, 102, 241, 0.4)',
                },
              }}
            />
          </Box>
        )}
        
        <Box sx={{ 
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          bgcolor: 'rgba(99, 102, 241, 0.1)',
          borderRadius: 3,
          p: 1.5,
          transition: 'all 0.3s ease',
          '&:focus-within': {
            bgcolor: 'rgba(99, 102, 241, 0.15)',
            boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.3)',
          }
        }}>
          <TextField
            fullWidth
            variant="standard"
            placeholder="Type a message..."
            value={chatMessage}
            onChange={handleMessageChange}
            onKeyPress={handleKeyPress}
            multiline
            maxRows={4}
            sx={{
              '& .MuiInputBase-root': {
                color: 'white',
                '&:before, &:after': {
                  display: 'none',
                },
              },
              '& .MuiInputBase-input': {
                py: 1,
                px: 2,
                fontSize: '0.95rem',
                '&::placeholder': {
                  color: 'rgba(255, 255, 255, 0.5)',
                  opacity: 1,
                },
              },
            }}
          />
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 0.5,
            pr: 1,
          }}>
            <Tooltip title="Attach file">
              <IconButton
                onClick={handleAttachmentClick}
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    color: 'white',
                    background: 'rgba(99, 102, 241, 0.2)',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <AttachFileIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <Tooltip title="Add emoji">
              <IconButton
                onClick={handleEmojiClick}
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    color: 'white',
                    background: 'rgba(99, 102, 241, 0.2)',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <EmojiIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Send message">
              <IconButton
                onClick={handleSendMessage}
                disabled={!chatMessage.trim() || isLoading}
                sx={{
                  color: 'white',
                  background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
                    transform: 'scale(1.1)',
                    boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  '&.Mui-disabled': {
                    background: 'rgba(139, 92, 246, 0.2)',
                    color: 'rgba(255, 255, 255, 0.5)',
                  }
                }}
              >
                {isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SendIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(17, 24, 39, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
          },
        }}
      >
        <MenuItem onClick={handleReply} sx={{ color: 'white' }}>
          <ReplyIcon sx={{ mr: 1 }} /> Reply
        </MenuItem>
        {selectedMessage?.isCurrentUser && (
          <>
            <MenuItem onClick={handleEdit} sx={{ color: 'white' }}>
              <EditIcon sx={{ mr: 1 }} /> Edit
            </MenuItem>
            <MenuItem onClick={handleDelete} sx={{ color: 'white' }}>
              <DeleteIcon sx={{ mr: 1 }} /> Delete
            </MenuItem>
          </>
        )}
      </Menu>

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError(null)} 
          severity="error"
          action={
            retryMessage && (
              <Button color="inherit" size="small" onClick={handleRetryMessage}>
                Retry
              </Button>
            )
          }
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

      {/* Emoji Picker Popover */}
      <Popover
        open={Boolean(emojiAnchorEl)}
        anchorEl={emojiAnchorEl}
        onClose={handleEmojiClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(17, 24, 39, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '16px',
            overflow: 'hidden',
            '& .emoji-picker-react': {
              bgcolor: 'transparent',
              boxShadow: 'none',
              '& .emoji-group:before': {
                bgcolor: 'rgba(17, 24, 39, 0.95)',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.875rem',
                fontWeight: 600,
                padding: '8px 12px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              },
              '& .emoji-search': {
                bgcolor: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: 'white',
                borderRadius: '12px',
                padding: '8px 12px',
                margin: '8px',
                '&:focus': {
                  borderColor: 'rgba(99, 102, 241, 0.8)',
                  boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.2)',
                },
                '&::placeholder': {
                  color: 'rgba(255, 255, 255, 0.5)',
                },
              },
              '& .emoji-categories': {
                bgcolor: 'rgba(17, 24, 39, 0.95)',
                padding: '8px',
                '& button': {
                  filter: 'brightness(0.8)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    filter: 'brightness(1)',
                    transform: 'scale(1.1)',
                  },
                  '&.active': {
                    filter: 'brightness(1)',
                    bgcolor: 'rgba(99, 102, 241, 0.2)',
                  },
                },
              },
              '& .emoji-scroll-wrapper': {
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
              },
              '& .emoji-group': {
                padding: '8px',
                '& .emoji': {
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.2)',
                    bgcolor: 'rgba(99, 102, 241, 0.2)',
                  },
                },
              },
            },
          },
        }}
      >
        <Box sx={{ 
          p: 1, 
          borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Typography variant="subtitle2" sx={{ 
            color: 'white',
            fontWeight: 600,
            ml: 1,
          }}>
            Emoji Picker
          </Typography>
          <IconButton
            onClick={handleEmojiClose}
            size="small"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                color: 'white',
                background: 'rgba(99, 102, 241, 0.2)',
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <EmojiPicker
          onEmojiClick={onEmojiClick}
          width={320}
          height={400}
          searchDisabled={false}
          skinTonesDisabled={true}
          previewConfig={{
            showPreview: false,
          }}
          searchPlaceHolder="Search emoji..."
          theme="dark"
        />
      </Popover>

      {/* Attachment Menu */}
      <Menu
        anchorEl={attachmentMenuAnchorEl}
        open={Boolean(attachmentMenuAnchorEl)}
        onClose={handleAttachmentClose}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(17, 24, 39, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
          },
        }}
      >
        <MenuItem onClick={() => handleFileSelect('image')} sx={{ color: 'white' }}>
          <ImageIcon sx={{ mr: 1 }} /> Image
        </MenuItem>
        <MenuItem onClick={() => handleFileSelect('document')} sx={{ color: 'white' }}>
          <DescriptionIcon sx={{ mr: 1 }} /> Document
        </MenuItem>
      </Menu>
    </Paper>
  );
}
