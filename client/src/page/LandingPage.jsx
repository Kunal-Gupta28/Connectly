import React from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Typography,
  Paper,
  Avatar,
} from '@mui/material';
import {
  Facebook,
  GitHub,
  LinkedIn,
  Twitter,
  VideoCall as VideoCallIcon,
  Lock as LockIcon,
  Group as GroupIcon,
  PersonAdd as PersonAddIcon,
  Login as LoginIcon,
  Security as SecurityIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import TrackingBall from '../component/TrackingBall';

// Enhanced glassCard style with modern colors and effects
const glassCard = {
  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(25px)',
  borderRadius: { xs: 24, md: 32 },
  border: '1px solid rgba(255, 255, 255, 0.15)',
  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.15)',
  color: '#CBD5E1',
  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  '@media (max-width: 600px)': {
    backdropFilter: 'blur(20px)',
    borderRadius: 24,
  }
};

// Enhanced animation variants for brand name with new effects
const brandVariants = {
  initial: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    background: 'linear-gradient(135deg, #FF6B6B, #FF8E8E)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    background: [
      'linear-gradient(135deg, #FF6B6B, #FF8E8E)',
      'linear-gradient(135deg, #FF8E8E, #FF6B6B)',
      'linear-gradient(135deg, #FF6B6B, #FF8E8E)'
    ],
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    transition: {
      duration: 3,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.1,
    background: 'linear-gradient(135deg, #FF6B6B, #FF8E8E)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

// Enhanced particle effect component with new colors and animations
const ParticleEffect = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ 
      opacity: [0.2, 0.4, 0.2],
      scale: [0.8, 1.2, 0.8],
      rotate: [0, 180, 360]
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }}
    style={{
      position: 'absolute',
      top: '-10px',
      left: '-10px',
      right: '-10px',
      bottom: '-10px',
      background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(124,58,237,0.15) 100%)',
      borderRadius: '12px',
      pointerEvents: 'none',
      filter: 'blur(8px)',
      '@media (max-width: 600px)': {
        filter: 'blur(4px)',
        top: '-5px',
        left: '-5px',
        right: '-5px',
        bottom: '-5px',
      }
    }}
  />
);

// Enhanced glow effect component with new colors and animations
const GlowEffect = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ 
      opacity: [0.3, 0.6, 0.3],
      scale: [1, 1.2, 1]
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }}
    style={{
      position: 'absolute',
      top: '-20px',
      left: '-20px',
      right: '-20px',
      bottom: '-20px',
      background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(124,58,237,0.1) 100%)',
      borderRadius: '16px',
      pointerEvents: 'none',
      filter: 'blur(12px)',
      zIndex: -1
    }}
  />
);

// Enhanced shimmer effect component with new animations
const ShimmerEffect = () => (
  <motion.div
    initial={{ x: '-100%', opacity: 0 }}
    animate={{ 
      x: '100%',
      opacity: [0, 0.5, 0]
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      repeatDelay: 1,
      ease: "easeInOut"
    }}
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
      transform: 'skewX(-20deg)',
      pointerEvents: 'none'
    }}
  />
);

// Enhanced BrandName component with new effects
const BrandName = ({ children, style = {} }) => (
  <motion.span
    variants={brandVariants}
    initial="initial"
    animate="animate"
    whileHover="hover"
    style={{
      display: 'inline-block',
      fontWeight: 'bold',
      position: 'relative',
      padding: '0 8px',
      '@media (max-width: 600px)': {
        padding: '0 4px',
        fontSize: '0.9em',
      },
      ...style
    }}
  >
    {children}
    <ParticleEffect />
    <GlowEffect />
    <ShimmerEffect />
  </motion.span>
);

// Add new floating elements component
const FloatingElements = () => (
  <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none' }}>
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1],
          x: [0, Math.random() * 100 - 50, 0],
          y: [0, Math.random() * 100 - 50, 0],
        }}
        transition={{
          duration: 5 + i,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        style={{
          position: 'absolute',
          width: Math.random() * 100 + 50,
          height: Math.random() * 100 + 50,
          background: `radial-gradient(circle, rgba(139, 92, 246, ${0.1 + i * 0.05}) 0%, transparent 70%)`,
          borderRadius: '50%',
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
        }}
      />
    ))}
  </Box>
);

// Enhanced Hero section
const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <Box
      component="section"
      sx={{
        minHeight: { xs: '80dvh', md: '90dvh' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
        color: '#F1F5F9',
        textAlign: 'center',
        px: { xs: 2, sm: 3 },
        py: { xs: 8, md: 12 },
        borderRadius: { xs: '2rem', md: '4rem' },
        mx: { xs: 2, sm: 3, md: 12 },
        mb: { xs: 4, md: 8 },
        boxShadow: '0 8px 40px rgba(139, 92, 246, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}
      aria-label="Hero section"
    >
      <FloatingElements />
      
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
          background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <Typography
            variant="h2"
            fontWeight="bold"
            gutterBottom
            sx={{
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: '0.15em',
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              mb: { xs: 3, md: 5 },
              color: '#FFFFFF',
              textShadow: '0 2px 10px rgba(139, 92, 246, 0.3)',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '180px',
                height: '4px',
                background: 'linear-gradient(90deg, #a78bfa, #7c3aed)',
                borderRadius: '2px'
              }
            }}
          >
            <BrandName>Connectly</BrandName>
            <Box 
              component="span" 
              sx={{ 
                display: 'block', 
                fontSize: '0.4em', 
                mt: 1, 
                color: '#E2E8F0',
                textShadow: '0 2px 10px rgba(139, 92, 246, 0.3)',
                letterSpacing: '0.2em',
                fontWeight: 500
              }}
            >
              Seamless Video Meetings
            </Box>
          </Typography>
          
          <Typography
            variant="h5"
            mb={6}
            sx={{
              fontWeight: 500,
              lineHeight: 1.6,
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
              px: { xs: 1, sm: 2 },
              color: '#CBD5E1',
              maxWidth: '800px',
              mx: 'auto',
              textShadow: '0 2px 10px rgba(139, 92, 246, 0.2)'
            }}
          >
            Connect with your team, clients, and friends anywhere, anytime — with{' '}
            <BrandName style={{ fontSize: { xs: '1.1em', md: '1.2em' } }}>Connectly</BrandName>
            's crystal clear video, screen sharing, and chat.
          </Typography>

          <Box 
            sx={{ 
              display: 'flex', 
              gap: 3, 
              justifyContent: 'center', 
              flexWrap: 'wrap',
              position: 'relative',
              zIndex: 1
            }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => navigate('/signup')}
                variant="contained"
                size="large"
                startIcon={<PersonAddIcon />}
                sx={{
                  px: { xs: 5, md: 7 },
                  py: { xs: 1.5, md: 2 },
                  borderRadius: '50px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  background: 'linear-gradient(45deg, #FF6B6B, #FF8E8E)',
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, #FF8E8E, #FF6B6B)',
                    opacity: 0,
                    transition: 'opacity 0.4s ease',
                  },
                  '&:hover': {
                    '&::before': {
                      opacity: 1,
                    },
                    boxShadow: '0 4px 20px rgba(255, 107, 107, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  '&:active': {
                    transform: 'translateY(1px)',
                  }
                }}
              >
                <span style={{ position: 'relative', zIndex: 1 }}>Sign Up</span>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => navigate('/login')}
                variant="outlined"
                size="large"
                startIcon={<LoginIcon />}
                sx={{
                  px: { xs: 5, md: 7 },
                  py: { xs: 1.5, md: 2 },
                  borderRadius: '50px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  borderColor: '#F1F5F9',
                  color: '#F1F5F9',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(255, 255, 255, 0.1)',
                    opacity: 0,
                    transition: 'opacity 0.4s ease',
                  },
                  '&:hover': {
                    '&::before': {
                      opacity: 1,
                    },
                    borderColor: '#F1F5F9',
                    transform: 'translateY(-2px)',
                  },
                  '&:active': {
                    transform: 'translateY(1px)',
                  }
                }}
              >
                <span style={{ position: 'relative', zIndex: 1 }}>Sign In</span>
              </Button>
            </motion.div>
          </Box>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Box
              sx={{
                mt: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                color: '#F1F5F9',
                fontSize: { xs: '0.9rem', md: '1rem' },
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '50px',
                py: 1.5,
                px: 4,
                mx: 'auto',
                maxWidth: 'fit-content',
                boxShadow: '0 2px 10px rgba(139, 92, 246, 0.2)',
                transition: 'all 0.4s ease',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.15)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
                }
              }}
            >
              <SecurityIcon sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#F1F5F9' }}>
                Secure, Private, and Reliable
              </Typography>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

const featuresData = [
  {
    icon: <VideoCallIcon fontSize="large" color="secondary" />,
    title: 'High-Quality Video',
    desc: 'Experience smooth, HD video streaming for meetings of any size.',
    gradient: 'linear-gradient(135deg, #FF6B6B, #FF8E8E)',
  },
  {
    icon: <LockIcon fontSize="large" color="secondary" />,
    title: 'End-to-End Encryption',
    desc: 'Your conversations are private and secure with robust encryption.',
    gradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
  },
  {
    icon: <GroupIcon fontSize="large" color="secondary" />,
    title: 'Collaborate Effortlessly',
    desc: 'Screen sharing, chat, and participant management in one app.',
    gradient: 'linear-gradient(135deg, #3B82F6, #2563EB)',
  },
];

const Features = () => (
  <Box
    component="section"
    sx={{
      py: { xs: 8, md: 16 },
      background: 'linear-gradient(to right, #7c3aed, #a78bfa)',
      borderRadius: { xs: '3rem', md: '5rem' },
      mx: { xs: 2, sm: 3, md: 12 },
      mb: { xs: 6, md: 10 },
      color: '#FFFFFF',
      boxShadow: '0 6px 40px rgba(139, 92, 246, 0.3)',
      position: 'relative',
      overflow: 'hidden'
    }}
    aria-label="Features"
  >
    <motion.div
      animate={{
        background: [
          'radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)',
          'radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)',
          'radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)'
        ]
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        repeatType: "reverse"
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none'
      }}
    />
    <Container maxWidth="lg">
      <Typography
        variant="h4"
        component="h2"
        textAlign="center"
        mb={{ xs: 6, md: 10 }}
        sx={{
          fontWeight: 'bold',
          letterSpacing: '0.1em',
          fontFamily: "'Poppins', sans-serif",
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
          color: '#FFFFFF',
          textShadow: '0 2px 10px rgba(139, 92, 246, 0.3)',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100px',
            height: '4px',
            background: 'linear-gradient(90deg, #a78bfa, #7c3aed)',
            borderRadius: '2px'
          }
        }}
      >
        Why Choose <BrandName>Connectly</BrandName>?
      </Typography>
      <Grid container spacing={{ xs: 3, md: 6 }} justifyContent="center">
        {featuresData.map(({ icon, title, desc, gradient }, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <motion.div
              initial="initial"
              whileHover="hover"
              variants={{
                initial: { scale: 1, y: 0 },
                hover: { 
                  scale: 1.05,
                  y: -10,
                  transition: {
                    duration: 0.3,
                    ease: "easeOut"
                  }
                }
              }}
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Paper
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: 2,
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '2rem',
                  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: gradient,
                    opacity: 0,
                    transition: 'opacity 0.4s ease',
                    zIndex: 0,
                  },
                  '&:hover': {
                    '&::before': {
                      opacity: 0.1,
                    },
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 40px rgba(139, 92, 246, 0.3)',
                  }
                }}
              >
                <Box
                  sx={{
                    color: '#FFFFFF',
                    fontSize: '3rem',
                    mb: 2,
                    filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))',
                    transition: 'transform 0.3s ease',
                    position: 'relative',
                    zIndex: 1,
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  {icon}
                </Box>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  mt={1}
                  mb={1}
                  sx={{ 
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                    color: '#FFFFFF',
                    textShadow: '0 2px 10px rgba(139, 92, 246, 0.3)',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.6,
                    fontWeight: 500,
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    color: 'rgba(255, 255, 255, 0.9)',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {desc}
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

const testimonialsData = [
  {
    name: 'Sarah Johnson',
    role: 'Product Manager',
    company: 'TechCorp',
    image: 'https://i.pravatar.cc/150?img=1',
    quote: 'Connectly has transformed how our remote team collaborates. The video quality is exceptional, and the interface is intuitive.',
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'Software Engineer',
    company: 'InnovateLabs',
    image: 'https://i.pravatar.cc/150?img=2',
    quote: "The end-to-end encryption gives us peace of mind for sensitive discussions. Best video conferencing solution we've used.",
    rating: 5
  },
  {
    name: 'Emma Rodriguez',
    role: 'Marketing Director',
    company: 'GrowthWave',
    image: 'https://i.pravatar.cc/150?img=3',
    quote: "The screen sharing and collaboration features are seamless. It's made our client meetings much more productive.",
    rating: 5
  }
];

const Testimonials = () => (
  <Box
    component="section"
    sx={{
      py: { xs: 8, md: 16 },
      background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)',
      borderRadius: { xs: '3rem', md: '5rem' },
      mx: { xs: 2, sm: 3, md: 12 },
      mb: { xs: 6, md: 10 },
      color: '#FFFFFF',
      position: 'relative',
      overflow: 'hidden'
    }}
    aria-label="Testimonials"
  >
    <motion.div
      animate={{
        background: [
          'radial-gradient(circle at 20% 20%, rgba(124, 58, 237, 0.15) 0%, transparent 50%)',
          'radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.15) 0%, transparent 50%)',
          'radial-gradient(circle at 20% 20%, rgba(124, 58, 237, 0.15) 0%, transparent 50%)'
        ]
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        repeatType: "reverse"
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none'
      }}
    />
    <Container maxWidth="lg">
      <Typography
        variant="h4"
        component="h2"
        textAlign="center"
        mb={{ xs: 6, md: 10 }}
        sx={{
          fontWeight: 'bold',
          letterSpacing: '0.1em',
          fontFamily: "'Poppins', sans-serif",
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
          color: '#FFFFFF',
          textShadow: '0 2px 10px rgba(139, 92, 246, 0.3)',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100px',
            height: '4px',
            background: 'linear-gradient(90deg, #a78bfa, #7c3aed)',
            borderRadius: '2px'
          }
        }}
      >
        What Our Users Say
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {testimonialsData.map((testimonial, index) => (
          <Grid item xs={12} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Paper
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '2rem',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 40px rgba(139, 92, 246, 0.2)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    src={testimonial.image}
                    alt={testimonial.name}
                    sx={{
                      width: 60,
                      height: 60,
                      border: '2px solid #7c3aed',
                      boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)',
                    }}
                  />
                  <Box sx={{ ml: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        color: '#FFFFFF',
                        fontSize: '1.1rem',
                      }}
                    >
                      {testimonial.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.9rem',
                      }}
                    >
                      {testimonial.role} at {testimonial.company}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontStyle: 'italic',
                    lineHeight: 1.6,
                    mb: 2,
                    flex: 1,
                  }}
                >
                  "{testimonial.quote}"
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon
                      key={i}
                      sx={{
                        color: '#FFD700',
                        fontSize: '1.2rem',
                      }}
                    />
                  ))}
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

const CallToAction = () => (
  <Box
    component="section"
    sx={{
      py: { xs: 8, md: 16 },
      background: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
      borderRadius: { xs: '3rem', md: '5rem' },
      mx: { xs: 2, sm: 3, md: 12 },
      mb: { xs: 6, md: 10 },
      color: '#FFFFFF',
      position: 'relative',
      overflow: 'hidden'
    }}
    aria-label="Call to Action"
  >
    <motion.div
      animate={{
        background: [
          'radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)',
          'radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)',
          'radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)'
        ]
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        repeatType: "reverse"
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none'
      }}
    />
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              background: 'linear-gradient(to right, #FFFFFF, #E2E8F0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 10px rgba(139, 92, 246, 0.3)',
            }}
          >
            Ready to Transform Your Meetings?
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 6,
              maxWidth: '800px',
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
              lineHeight: 1.6,
            }}
          >
            Join thousands of teams who trust Connectly for seamless video conferencing.
            Experience crystal-clear video, secure communication, and powerful collaboration tools.
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
            }}
          >
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/signup"
              sx={{
                background: '#FFFFFF',
                color: '#7c3aed',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: '2rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  background: '#F3F4F6',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 25px rgba(0, 0, 0, 0.25)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Get Started Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/demo"
              sx={{
                borderColor: '#FFFFFF',
                color: '#FFFFFF',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: '2rem',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderColor: '#FFFFFF',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Request Demo
            </Button>
          </Box>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="body2"
            sx={{
              mt: 4,
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.9rem',
            }}
          >
            No credit card required • 14-day free trial • Cancel anytime
          </Typography>
        </motion.div>
      </Box>
    </Container>
  </Box>
);

const Footer = () => (
  <Box
    component="footer"
    sx={{
      py: 12,
      textAlign: 'center',
      backgroundColor: '#1E293B',
      color: '#E0E7FF',
      borderTopLeftRadius: '3rem',
      borderTopRightRadius: '3rem',
      mt: 24,
      boxShadow: '0 -6px 40px rgba(139, 92, 246, 0.5)',
    }}
    aria-label="Site Footer"
  >
    <Container maxWidth="lg">
      <Typography variant="body2" mb={3} sx={{ fontWeight: 500 }}>
        &copy; {new Date().getFullYear()} Connectly. All rights reserved.
      </Typography>
      <Typography variant="body2" mb={4} sx={{ fontStyle: 'italic' }}>
        Contact us: support@connectly.com
      </Typography>
      <Box>
        {[{
          icon: <Facebook />,
          href: 'https://facebook.com',
          label: 'Facebook',
        }, {
          icon: <Twitter />,
          href: 'https://twitter.com',
          label: 'Twitter',
        }, {
          icon: <LinkedIn />,
          href: 'https://linkedin.com',
          label: 'LinkedIn',
        }, {
          icon: <GitHub />,
          href: 'https://github.com',
          label: 'GitHub',
        }].map(({ icon, href, label }) => (
          <IconButton
            key={label}
            component="a"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            color="inherit"
            sx={{
              mx: 1,
              transition: 'all 0.3s ease',
              '&:hover': {
                color: '#a78bfa',
                transform: 'scale(1.3)',
              },
            }}
          >
            {icon}
          </IconButton>
        ))}
      </Box>
    </Container>
  </Box>
);

const LandingPage = () => {
  return (
    <Box>
      <TrackingBall />
      <Hero />
      <Features />
      <Testimonials />
      <CallToAction />
      <Footer />
    </Box>
  );
};

export default LandingPage;
