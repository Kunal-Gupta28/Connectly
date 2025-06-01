import React from 'react';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import TrackingBall from '../component/TrackingBall';
import {
  FloatingParticles,
  AnimatedBorder,
  AnimatedInput,
  AnimatedButton,
  AnimatedIcon,
  AnimatedCheckmark,
  AnimatedError,
} from '../component/Animations';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.4,
      ease: 'easeIn',
    },
  },
};

const formVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.2,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
};

const inputVariants = {
  focus: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    boxShadow: '0 8px 20px rgba(107, 70, 193, 0.3)',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
    },
  },
};

export default function Signup() {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const navigator = useNavigate();

    const validateForm = () => {
        if (!name || !email || !password) {
            return 'All fields are required.';
        }

        // Email validation
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address.';
        }

        // Password validation
        if (password.length < 6 || password.length > 20) {
            return 'Password must be between 6 and 20 characters.';
        }

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the form before submitting
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError('');
        setIsSubmitting(true);

        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/user/register`, {
                name,
                email,
                password
            });
            if (res.status === StatusCodes.CREATED) {
                const token= res.data.token;
                localStorage.setItem('token', token);
                navigator('/home');
            } else {
                console.error('Signup failed');
                setName('');
                setEmail('');
                setPassword('');
                setError('Signup failed. Please try again later.');
            }
        } catch (error) {
            console.error('Error:', error.response?.data?.message || error.message);
            setError(error.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const navigateToLanding = () => {
        navigator('/');
    };

    return (
        <Box
            component={motion.div}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            sx={{
                minHeight: '100dvh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: { xs: 2, sm: 4 },
                py: 4,
                position: 'relative',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                overflow: 'hidden',
                width: '100%',
            }}
        >
            <TrackingBall />
            <FloatingParticles />

            <IconButton
                component={motion.button}
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={navigateToLanding}
                sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    color: '#FFFFFF',
                    '&:hover': {
                        color: '#F1F5F9',
                    },
                }}
            >
                <AnimatedIcon>
                <ArrowBackIcon />
                </AnimatedIcon>
            </IconButton>

            <AnimatedBorder>
            <Paper
                component={motion.div}
                variants={formVariants}
                initial="initial"
                animate="animate"
                sx={{
                    p: { xs: 3, sm: 4 },
                    maxWidth: 400,
                    width: '100%',
                    backdropFilter: 'blur(20px)',
                    backgroundColor: 'rgba(26, 26, 46, 0.8)',
                    border: '1px solid rgba(107, 70, 193, 0.3)',
                    borderRadius: '24px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    mx: 2,
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Typography
                        variant="h4"
                        component="h1"
                        align="center"
                        gutterBottom
                        sx={{
                            fontWeight: 'bold',
                            mb: 1,
                            background: 'linear-gradient(45deg, #FFFFFF, #F1F5F9)',
                            backgroundClip: 'text',
                            textFillColor: 'transparent',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Create Account
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        align="center"
                        sx={{
                            mb: 4,
                            color: '#E2E8F0',
                        }}
                    >
                        Join us and start your journey
                    </Typography>
                </motion.div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                                    <AnimatedError />
                                    <Typography color="error" align="center" sx={{ ml: 1 }}>
                                {error}
                            </Typography>
                                </Box>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit}>
                        <AnimatedInput>
                        <TextField
                            fullWidth
                            label="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                            <AnimatedIcon>
                                        <PersonIcon sx={{ color: 'rgba(203, 213, 225, 0.7)' }} />
                                            </AnimatedIcon>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                mb: 3,
                                '& .MuiOutlinedInput-root': {
                                    color: '#FFFFFF',
                                    '& fieldset': {
                                        borderColor: 'rgba(107, 70, 193, 0.3)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(107, 70, 193, 0.5)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#6b46c1',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'rgba(203, 213, 225, 0.7)',
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#b794f4',
                                },
                            }}
                        />
                        </AnimatedInput>

                        <AnimatedInput>
                        <TextField
                            fullWidth
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                            <AnimatedIcon>
                                        <EmailIcon sx={{ color: 'rgba(203, 213, 225, 0.7)' }} />
                                            </AnimatedIcon>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                mb: 3,
                                '& .MuiOutlinedInput-root': {
                                    color: '#FFFFFF',
                                    '& fieldset': {
                                        borderColor: 'rgba(107, 70, 193, 0.3)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(107, 70, 193, 0.5)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#6b46c1',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'rgba(203, 213, 225, 0.7)',
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#b794f4',
                                },
                            }}
                        />
                        </AnimatedInput>

                        <AnimatedInput>
                        <TextField
                            fullWidth
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                            <AnimatedIcon>
                                        <LockIcon sx={{ color: 'rgba(203, 213, 225, 0.7)' }} />
                                            </AnimatedIcon>
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            sx={{ color: 'rgba(203, 213, 225, 0.7)' }}
                                        >
                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                mb: 3,
                                '& .MuiOutlinedInput-root': {
                                    color: '#FFFFFF',
                                    '& fieldset': {
                                        borderColor: 'rgba(107, 70, 193, 0.3)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(107, 70, 193, 0.5)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#6b46c1',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'rgba(203, 213, 225, 0.7)',
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#b794f4',
                                },
                            }}
                        />
                        </AnimatedInput>

                        <AnimatedButton>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isSubmitting}
                            sx={{
                                py: 1.5,
                                mb: 2,
                                background: 'linear-gradient(45deg, #6b46c1, #b794f4)',
                                color: '#FFFFFF',
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #553c9a, #9f7aea)',
                                    boxShadow: '0 8px 20px rgba(107, 70, 193, 0.4)',
                                },
                            }}
                        >
                            {isSubmitting ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Create Account'
                            )}
                        </Button>
                        </AnimatedButton>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Typography align="center" sx={{ color: '#CBD5E1' }}>
                            Already have an account?{' '}
                            <Button
                                onClick={() => navigator('/login')}
                                sx={{
                                    color: '#b794f4',
                                    fontWeight: 600,
                                    '&:hover': {
                                        color: '#9f7aea',
                                        background: 'rgba(107, 70, 193, 0.1)',
                                    },
                                }}
                            >
                                Log in
                            </Button>
                        </Typography>
                    </motion.div>
                </form>
            </Paper>
            </AnimatedBorder>
        </Box>
    );
}