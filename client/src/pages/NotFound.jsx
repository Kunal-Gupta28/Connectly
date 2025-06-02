import React from 'react';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import FloatingParticles from '../components/FloatingParticles';
import TrackingBall from '../components/TrackingBall';

const gradientText = {
  background: 'linear-gradient(45deg, #FFFFFF, #E0E7FF)',
  backgroundClip: 'text',
  textFillColor: 'transparent',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const glassCard = {
  background: 'rgba(17, 24, 39, 0.8)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(99, 102, 241, 0.3)',
  borderRadius: '24px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
};

const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const pulseAnimation = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #111827 0%, #1E293B 100%)',
        position: 'relative',
        overflow: 'hidden',
        p: 2,
      }}
    >
      <TrackingBall />
      <FloatingParticles />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ position: 'absolute', top: 16, left: 16 }}
      >
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              color: 'white',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          Go Back
        </Button>
      </motion.div>

      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={0}
            sx={{
              ...glassCard,
              p: { xs: 4, sm: 6 },
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Decorative elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              style={{
                position: 'absolute',
                top: -100,
                right: -100,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(107, 70, 193, 0.3) 0%, rgba(107, 70, 193, 0) 70%)',
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              style={{
                position: 'absolute',
                bottom: -100,
                left: -100,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(107, 70, 193, 0.3) 0%, rgba(107, 70, 193, 0) 70%)',
              }}
            />

            <motion.div
              variants={floatingAnimation}
              initial="initial"
              animate="animate"
            >
              <Typography
                variant="h1"
                sx={{
                  ...gradientText,
                  fontSize: { xs: '8rem', sm: '12rem' },
                  fontWeight: 'bold',
                  lineHeight: 1,
                  textShadow: '0 0 20px rgba(107, 70, 193, 0.3)',
                }}
              >
                404
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Typography
                variant="h4"
                sx={{
                  ...gradientText,
                  mb: 2,
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                  fontWeight: 600,
                }}
              >
                Oops! Page Not Found
              </Typography>
              <Typography
                variant="body1"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  mb: 4,
                  maxWidth: '400px',
                  mx: 'auto',
                }}
              >
                The page you're looking for doesn't exist or has been moved.
                Let's get you back on track!
              </Typography>
            </motion.div>

            <motion.div
              variants={pulseAnimation}
              initial="initial"
              animate="animate"
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<HomeIcon />}
                onClick={() => navigate('/home')}
                sx={{
                  bgcolor: 'rgba(107, 70, 193, 0.8)',
                  '&:hover': { 
                    bgcolor: 'rgba(107, 70, 193, 0.9)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(107, 70, 193, 0.4)',
                  },
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  transition: 'all 0.3s ease',
                }}
              >
                Back to Home
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Typography
                variant="body2"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.5)',
                  mt: 2,
                }}
              >
                Need help? Contact support
              </Typography>
            </motion.div>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
} 