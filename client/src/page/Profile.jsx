import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  Grid,
  TextField,
  Divider,
  IconButton
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  CameraAlt as CameraAltIcon,
} from '@mui/icons-material';

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

export default function Profile() {
  const [isEditing, setIsEditing] = React.useState(false);
  const [profileData, setProfileData] = React.useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Connectly Meeting Host',
    bio: 'Passionate about connecting people through technology.',
    location: 'San Francisco, CA',
    timezone: 'Pacific Time (PT)',
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save the data to your backend
  };

  return (
    <Box sx={{ 
      minHeight: '100dvh', 
      bgcolor: '#111827',
      background: 'linear-gradient(135deg, #111827 0%, #1E293B 100%)',
      pt: 10,
      pb: 4,
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Profile Header */}
          <Grid item xs={12}>
            <Paper
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              sx={{
                ...glassCard,
                p: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: 'rgba(107, 70, 193, 0.8)',
                    fontSize: '3rem',
                  }}
                >
                  JD
                </Avatar>
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'rgba(107, 70, 193, 0.8)',
                    '&:hover': { bgcolor: 'rgba(107, 70, 193, 0.9)' },
                  }}
                >
                  <CameraAltIcon />
                </IconButton>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ ...gradientText, mb: 1 }}>
                  {profileData.name}
                </Typography>
                <Typography variant="subtitle1" color="rgba(255, 255, 255, 0.7)">
                  {profileData.role}
                </Typography>
                <Typography variant="body2" color="rgba(255, 255, 255, 0.5)">
                  {profileData.email}
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                onClick={isEditing ? handleSave : handleEdit}
                sx={{
                  bgcolor: 'rgba(107, 70, 193, 0.8)',
                  '&:hover': { bgcolor: 'rgba(107, 70, 193, 0.9)' },
                }}
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </Paper>
          </Grid>

          {/* Profile Details */}
          <Grid item xs={12} md={8}>
            <Paper
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              sx={{ ...glassCard, p: 4 }}
            >
              <Typography variant="h6" sx={{ ...gradientText, mb: 3 }}>
                Profile Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bio"
                    multiline
                    rows={4}
                    value={profileData.bio}
                    disabled={!isEditing}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(107, 70, 193, 0.5)' },
                        '&:hover fieldset': { borderColor: 'rgba(107, 70, 193, 0.8)' },
                        '&.Mui-focused fieldset': { borderColor: 'rgba(107, 70, 193, 1)' },
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={profileData.location}
                    disabled={!isEditing}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(107, 70, 193, 0.5)' },
                        '&:hover fieldset': { borderColor: 'rgba(107, 70, 193, 0.8)' },
                        '&.Mui-focused fieldset': { borderColor: 'rgba(107, 70, 193, 1)' },
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Timezone"
                    value={profileData.timezone}
                    disabled={!isEditing}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(107, 70, 193, 0.5)' },
                        '&:hover fieldset': { borderColor: 'rgba(107, 70, 193, 0.8)' },
                        '&.Mui-focused fieldset': { borderColor: 'rgba(107, 70, 193, 1)' },
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Stats and Settings */}
          <Grid item xs={12} md={4}>
            <Paper
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              sx={{ ...glassCard, p: 4 }}
            >
              <Typography variant="h6" sx={{ ...gradientText, mb: 3 }}>
                Meeting Stats
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.5)">
                    Total Meetings
                  </Typography>
                  <Typography variant="h4" sx={{ ...gradientText }}>
                    128
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                <Box>
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.5)">
                    Hours in Meetings
                  </Typography>
                  <Typography variant="h4" sx={{ ...gradientText }}>
                    256
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                <Box>
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.5)">
                    Average Rating
                  </Typography>
                  <Typography variant="h4" sx={{ ...gradientText }}>
                    4.8/5
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 