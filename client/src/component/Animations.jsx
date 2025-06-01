import React from 'react';
import { motion } from 'framer-motion';

// Floating particles background
export const FloatingParticles = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: Math.random() * 10 + 5,
            height: Math.random() * 10 + 5,
            background: `rgba(107, 70, 193, ${Math.random() * 0.3})`,
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Animated gradient border
export const AnimatedBorder = ({ children }) => {
  return (
    <motion.div
      style={{
        position: 'relative',
        padding: '2px',
        borderRadius: '24px',
        background: 'linear-gradient(45deg, #6b46c1, #b794f4, #6b46c1)',
        backgroundSize: '200% 200%',
      }}
      animate={{
        backgroundPosition: ['0% 0%', '100% 100%'],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "linear",
      }}
    >
      {children}
    </motion.div>
  );
};

// Animated input field
export const AnimatedInput = ({ children }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
    >
      {children}
    </motion.div>
  );
};

// Animated button
export const AnimatedButton = ({ children }) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.05,
        boxShadow: '0 8px 20px rgba(107, 70, 193, 0.3)',
      }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
    >
      {children}
    </motion.div>
  );
};

// Animated icon
export const AnimatedIcon = ({ children }) => {
  return (
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
      {children}
    </motion.div>
  );
};

// Animated success checkmark
export const AnimatedCheckmark = () => {
  return (
    <motion.svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#4CAF50"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <motion.path
        d="M20 6L9 17L4 12"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </motion.svg>
  );
};

// Animated error X
export const AnimatedError = () => {
  return (
    <motion.svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#EF4444"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ rotate: -90, opacity: 0 }}
      animate={{ rotate: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <motion.line
        x1="18"
        y1="6"
        x2="6"
        y2="18"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      <motion.line
        x1="6"
        y1="6"
        x2="18"
        y2="18"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}; 