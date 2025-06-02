import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  TextField,
  Grid,
  Divider,
  IconButton,
  Switch,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  CameraAlt as CameraIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  ArrowBack as ArrowBackIcon,
  PhotoCamera as PhotoCameraIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/userContext';
import TrackingBall from '../components/TrackingBall';
import { toast } from 'react-toastify';
import axios from 'axios';

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
    },
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


export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    language: user?.language || 'en',
    theme: user?.theme || 'dark',
    name: user?.name || '',
    bio: user?.bio || '',
  });
  const [settings, setSettings] = useState({
    emailNotifications: user?.settings?.emailNotifications || true,
    pushNotifications: user?.settings?.pushNotifications || true,
    twoFactorAuth: user?.settings?.twoFactorAuth || false,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [profileImage, setProfileImage] = useState(user?.avatar || null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSettingChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.firstName?.trim() || !formData.lastName?.trim()) {
        toast.error('First name and last name are required');
        return;
      }

      // Format the request data
      const requestData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone?.trim() || '',
        language: formData.language,
        theme: formData.theme,
        settings: {
          emailNotifications: settings.emailNotifications,
          pushNotifications: settings.pushNotifications,
          twoFactorAuth: settings.twoFactorAuth
        },
        bio: formData.bio?.trim() || ''
      };

      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/user/profile`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.status === 200) {
        await updateUser(response.data);
        setIsEditing(false);
        toast.success('Profile updated successfully! 🎉');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      
      if (error.response) {
        // Handle validation errors
        if (error.response.status === 400) {
          const errorMessage = error.response.data.message || 
            (error.response.data.errors && error.response.data.errors.map(e => e.msg).join(', '));
          toast.error(errorMessage || 'Invalid profile data');
        } else if (error.response.status === 401) {
          toast.error('Please log in again to update your profile');
        } else {
          toast.error(error.response.data.message || 'Failed to update profile');
        }
      } else if (error.request) {
        toast.error('Network error. Please check your connection');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset file input
    e.target.value = '';

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a JPG, JPEG, PNG, or GIF image.');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading('Uploading image...');
    setIsUploading(true);

    try {
      const formData = new FormData();
      // Use 'avatar' as the field name
      formData.append('avatar', file, file.name);

      // Log the request details for debugging
      console.log('Uploading file:', {
        name: file.name,
        type: file.type,
        size: file.size,
        formData: Object.fromEntries(formData.entries())
      });

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/user/profile/avatar`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            // Add boundary to the Content-Type header
            'Accept': 'application/json',
          },
          // Add upload progress handler
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            toast.loading(`Uploading: ${percentCompleted}%`, { toastId: loadingToast });
          },
        }
      );

      // Log the response for debugging
      console.log('Upload response:', response.data);

      if (response.data.avatar) {
        // Update local state
        setProfileImage(response.data.avatar);
        await updateUser({ avatar: response.data.avatar });
        
        // Dismiss loading toast and show success
        toast.dismiss(loadingToast);
        toast.success('Profile image updated successfully! 🎉');
      } else {
        throw new Error('No avatar URL in response');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Show specific error messages
      if (error.response) {
        const errorMessage = error.response.data.message || 'Failed to upload image';
        console.error('Upload error details:', {
          status: error.response.status,
          data: error.response.data,
          message: errorMessage,
          headers: error.response.headers,
          config: {
            headers: error.config?.headers,
            data: error.config?.data
          }
        });

        switch (error.response.status) {
          case 400:
            toast.error(errorMessage);
            break;
          case 401:
            toast.error('Please log in again to update your profile');
            break;
          case 413:
            toast.error('Image file is too large. Maximum size is 5MB');
            break;
          default:
            toast.error(errorMessage);
        }
      } else if (error.request) {
        console.error('Network error:', error.request);
        toast.error('Network error. Please check your connection and try again.');
      } else {
        console.error('Upload error:', error.message);
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      language: user?.language || 'en',
      theme: user?.theme || 'dark',
      name: user?.name || '',
      bio: user?.bio || '',
    });
    // Reset settings to original user settings
    setSettings({
      emailNotifications: user?.settings?.emailNotifications || true,
      pushNotifications: user?.settings?.pushNotifications || true,
      twoFactorAuth: user?.settings?.twoFactorAuth || false,
    });
    setIsEditing(false);
  };

  // first letter of name
  const getUserInitials = () => {
    if (!user?.firstName || !user?.lastName) return '?';
    // Get first letter of first name and first letter of last name
    return (user.firstName[0] + user.lastName[0]).toUpperCase();
  };

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        bgcolor: '#111827',
        background: 'linear-gradient(135deg, #111827 0%, #1E293B 100%)',
        position: 'relative',
        overflow: 'hidden',
        py: 4,
      }}
    >
      <TrackingBall />
      
      <Container maxWidth="lg">
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            color: 'white',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={4}>
            {/* Profile Header */}
            <Grid item xs={12}>
              <Paper
                component={motion.div}
                variants={itemVariants}
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
                    src={user?.avatar || profileImage}
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: 'rgba(99, 102, 241, 0.8)',
                      fontSize: '2.5rem',
                      opacity: isUploading ? 0.7 : 1,
                      transition: 'opacity 0.3s ease',
                    }}
                  >
                    {!user?.avatar && !profileImage && getUserInitials()}
                  </Avatar>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    id="avatar-input"
                    ref={fileInputRef}
                    disabled={isUploading}
                  />
                  <label htmlFor="avatar-input">
                    <IconButton
                      component="span"
                      disabled={isUploading}
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: isUploading ? 'rgba(99, 102, 241, 0.5)' : 'rgba(99, 102, 241, 0.8)',
                        '&:hover': {
                          bgcolor: isUploading ? 'rgba(99, 102, 241, 0.5)' : 'rgba(99, 102, 241, 0.9)',
                        },
                        transition: 'all 0.3s ease',
                        cursor: isUploading ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {isUploading ? (
                        <CircularProgress size={24} sx={{ color: 'white' }} />
                      ) : (
                        <PhotoCameraIcon />
                      )}
                    </IconButton>
                  </label>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" color="white" gutterBottom>
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  <Typography variant="body1" color="rgba(255, 255, 255, 0.7)">
                    {user?.email}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    {isEditing ? (
                      <>
                        <Button
                          variant="outlined"
                          startIcon={<SaveIcon />}
                          onClick={handleSave}
                          sx={{
                            borderColor: 'rgba(99, 102, 241, 0.5)',
                            color: 'white',
                            '&:hover': {
                              borderColor: 'rgba(99, 102, 241, 0.8)',
                              background: 'rgba(99, 102, 241, 0.1)',
                            },
                          }}
                        >
                          Save Changes
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={handleCancel}
                          sx={{
                            borderColor: 'rgba(239, 68, 68, 0.5)',
                            color: 'white',
                            '&:hover': {
                              borderColor: 'rgba(239, 68, 68, 0.8)',
                              background: 'rgba(239, 68, 68, 0.1)',
                            },
                          }}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => setIsEditing(true)}
                        sx={{
                          borderColor: 'rgba(99, 102, 241, 0.5)',
                          color: 'white',
                          '&:hover': {
                            borderColor: 'rgba(99, 102, 241, 0.8)',
                            background: 'rgba(99, 102, 241, 0.1)',
                          },
                        }}
                      >
                        Edit Profile
                      </Button>
                    )}
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Profile Details */}
            <Grid item xs={12} md={8}>
              <Paper
                component={motion.div}
                variants={itemVariants}
                sx={{
                  ...glassCard,
                  p: 4,
                }}
              >
                <Typography variant="h6" color="white" gutterBottom>
                  Profile Information
                </Typography>
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': {
                            borderColor: 'rgba(99, 102, 241, 0.3)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(99, 102, 241, 0.5)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255, 255, 255, 0.7)',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': {
                            borderColor: 'rgba(99, 102, 241, 0.3)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(99, 102, 241, 0.5)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255, 255, 255, 0.7)',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': {
                            borderColor: 'rgba(99, 102, 241, 0.3)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(99, 102, 241, 0.5)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255, 255, 255, 0.7)',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': {
                            borderColor: 'rgba(99, 102, 241, 0.3)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(99, 102, 241, 0.5)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255, 255, 255, 0.7)',
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Settings */}
            <Grid item xs={12} md={4}>
              <Paper
                component={motion.div}
                variants={itemVariants}
                sx={{
                  ...glassCard,
                  p: 4,
                }}
              >
                <Typography variant="h6" color="white" gutterBottom>
                  Settings
                </Typography>
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 3 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={() => handleSettingChange('emailNotifications')}
                        color="primary"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <NotificationsIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                        <Typography color="white">Email Notifications</Typography>
                      </Box>
                    }
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.pushNotifications}
                        onChange={() => handleSettingChange('pushNotifications')}
                        color="primary"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <NotificationsIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                        <Typography color="white">Push Notifications</Typography>
                      </Box>
                    }
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.twoFactorAuth}
                        onChange={() => handleSettingChange('twoFactorAuth')}
                        color="primary"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SecurityIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                        <Typography color="white">Two-Factor Authentication</Typography>
                      </Box>
                    }
                  />

                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Language</InputLabel>
                    <Select
                      value={formData.language}
                      onChange={handleInputChange}
                      name="language"
                      disabled={!isEditing}
                      sx={{
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(99, 102, 241, 0.3)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(99, 102, 241, 0.5)',
                        },
                        '& .MuiSvgIcon-root': {
                          color: 'rgba(255, 255, 255, 0.7)',
                        },
                      }}
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="es">Spanish</MenuItem>
                      <MenuItem value="fr">French</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Theme</InputLabel>
                    <Select
                      value={formData.theme}
                      onChange={handleInputChange}
                      name="theme"
                      disabled={!isEditing}
                      sx={{
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(99, 102, 241, 0.3)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(99, 102, 241, 0.5)',
                        },
                        '& .MuiSvgIcon-root': {
                          color: 'rgba(255, 255, 255, 0.7)',
                        },
                      }}
                    >
                      <MenuItem value="light">Light</MenuItem>
                      <MenuItem value="dark">Dark</MenuItem>
                      <MenuItem value="system">System</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            bgcolor: snackbar.severity === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
            color: 'white',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 