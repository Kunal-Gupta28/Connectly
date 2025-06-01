import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TrackingBall = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: 9999,
      overflow: 'hidden'
    }}>
      {/* Outer glow */}
      <motion.div
        animate={{ 
          x: mousePosition.x,
          y: mousePosition.y,
          scale: [1, 1.1, 1],
        }}
        transition={{
          x: {
            type: "spring",
            damping: 10,
            stiffness: 80,
            mass: 1.5
          },
          y: {
            type: "spring",
            damping: 10,
            stiffness: 80,
            mass: 1.5
          },
          scale: {
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }
        }}
        style={{
          position: 'absolute',
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, rgba(124, 58, 237, 0.1) 50%, transparent 70%)',
          filter: 'blur(8px)',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 40px rgba(139, 92, 246, 0.3)',
        }}
      />

      {/* Main ball */}
      <motion.div
        animate={{ 
          x: mousePosition.x,
          y: mousePosition.y,
          scale: [1, 1.05, 1],
        }}
        transition={{
          x: {
            type: "spring",
            damping: 12,
            stiffness: 100,
            mass: 1.2
          },
          y: {
            type: "spring",
            damping: 12,
            stiffness: 100,
            mass: 1.2
          },
          scale: {
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }
        }}
        style={{
          position: 'absolute',
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(124, 58, 237, 0.4))',
          filter: 'blur(3px)',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 30px rgba(139, 92, 246, 0.3)',
          border: '2px solid rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(5px)',
        }}
      />

      {/* Middle layer */}
      <motion.div
        animate={{ 
          x: mousePosition.x,
          y: mousePosition.y,
          scale: [1, 1.1, 1],
        }}
        transition={{
          x: {
            type: "spring",
            damping: 15,
            stiffness: 120,
            mass: 1
          },
          y: {
            type: "spring",
            damping: 15,
            stiffness: 120,
            mass: 1
          },
          scale: {
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }
        }}
        style={{
          position: 'absolute',
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.4)',
          filter: 'blur(2px)',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(3px)',
        }}
      />

      {/* Inner core */}
      <motion.div
        animate={{ 
          x: mousePosition.x,
          y: mousePosition.y,
          scale: [1, 1.2, 1],
        }}
        transition={{
          x: {
            type: "spring",
            damping: 20,
            stiffness: 150,
            mass: 0.8
          },
          y: {
            type: "spring",
            damping: 20,
            stiffness: 150,
            mass: 0.8
          },
          scale: {
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }
        }}
        style={{
          position: 'absolute',
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.6)',
          filter: 'blur(1px)',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 15px rgba(255, 255, 255, 0.4)',
        }}
      />
    </div>
  );
};

export default TrackingBall; 