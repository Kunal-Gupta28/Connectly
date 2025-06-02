import React from 'react';
import { motion } from 'framer-motion';

// Animated background grid
export const AnimatedGrid = () => {
  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(107, 70, 193, 0.1) 100%)',
        zIndex: -1,
      }}
      animate={{
        background: [
          'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(107, 70, 193, 0.1) 100%)',
          'linear-gradient(135deg, rgba(107, 70, 193, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
          'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(107, 70, 193, 0.1) 100%)',
        ],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
};

// Animated card component
export const AnimatedCard = ({ children }) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        boxShadow: '0 8px 32px rgba(99, 102, 241, 0.2)',
      }}
      whileTap={{ scale: 0.98 }}
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {children}
    </motion.div>
  );
};

// Glowing button component
export const GlowingButton = ({ children, onClick }) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        boxShadow: '0 0 10px rgba(99, 102, 241, 0.3)',
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      <motion.div
        animate={{
          boxShadow: [
            '0 0 5px rgba(99, 102, 241, 0.2)',
            '0 0 10px rgba(99, 102, 241, 0.3)',
            '0 0 5px rgba(99, 102, 241, 0.2)',
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
        }}
      />
      {children}
    </motion.div>
  );
};

// Animated notification badge
export const AnimatedBadge = ({ count }) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.2 }}
      style={{
        position: 'absolute',
        top: -5,
        right: -5,
        background: '#EF4444',
        color: 'white',
        borderRadius: '50%',
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 'bold',
      }}
    >
      {count}
    </motion.div>
  );
};

// Animated loading spinner
export const AnimatedSpinner = () => {
  return (
    <motion.div
      animate={{
        rotate: 360,
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        width: '24px',
        height: '24px',
        border: '2px solid rgba(99, 102, 241, 0.3)',
        borderTop: '2px solid #6366F1',
        borderRadius: '50%',
      }}
    />
  );
}; 