import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

const FloatingParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2d context from canvas');
      return;
    }

    let animationFrameId;
    let particles = [];
    let isActive = true;
    let mousePosition = { x: null, y: null };
    let mouseRadius = 150;

    // Set canvas size
    const resizeCanvas = () => {
      if (!canvas || !ctx || !isActive) return;
      
      // Store the current device pixel ratio
      const dpr = window.devicePixelRatio || 1;
      
      // Set the canvas size accounting for device pixel ratio
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      
      // Scale the context to match the device pixel ratio
      ctx.scale(dpr, dpr);
      
      // Set the canvas CSS size
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      
      // Recreate particles after resize
      if (isActive) {
        createParticles();
      }
    };

    // Particle class with enhanced properties
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1; // Increased size range
        this.speedX = Math.random() * 0.8 - 0.4; // Increased speed range
        this.speedY = Math.random() * 0.8 - 0.4;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = this.getRandomColor();
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = (Math.random() - 0.5) * 0.02;
        this.oscillationSpeed = Math.random() * 0.02 + 0.01;
        this.oscillationRange = Math.random() * 20 + 10;
        this.oscillationOffset = Math.random() * Math.PI * 2;
      }

      getRandomColor() {
        const colors = [
          'rgba(107, 70, 193, ', // Purple
          'rgba(139, 92, 246, ', // Lighter purple
          'rgba(167, 139, 250, ', // Even lighter purple
          'rgba(199, 210, 254, ', // Very light purple
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        return color;
      }

      update() {
        // Update position with oscillation
        this.angle += this.angleSpeed;
        this.oscillationOffset += this.oscillationSpeed;
        
        const oscillation = Math.sin(this.oscillationOffset) * this.oscillationRange;
        
        this.x += this.speedX + Math.cos(this.angle) * 0.5;
        this.y += this.speedY + Math.sin(this.angle) * 0.5 + oscillation * 0.1;

        // Mouse interaction
        if (mousePosition.x !== null && mousePosition.y !== null) {
          const dx = this.x - mousePosition.x;
          const dy = this.y - mousePosition.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouseRadius) {
            const angle = Math.atan2(dy, dx);
            const force = (mouseRadius - distance) / mouseRadius;
            this.x += Math.cos(angle) * force * 2;
            this.y += Math.sin(angle) * force * 2;
          }
        }

        // Reset particle if it goes off screen with padding
        const padding = 50;
        if (
          this.x < -padding || 
          this.x > canvas.width + padding || 
          this.y < -padding || 
          this.y > canvas.height + padding
        ) {
          this.reset();
          // Reset to opposite side for smoother transitions
          if (this.x < -padding) this.x = canvas.width + padding;
          if (this.x > canvas.width + padding) this.x = -padding;
          if (this.y < -padding) this.y = canvas.height + padding;
          if (this.y > canvas.height + padding) this.y = -padding;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color}${this.opacity})`;
        ctx.fill();

        // Add glow effect
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color}${this.opacity * 0.3})`;
        ctx.fill();
      }
    }

    // Create particles with increased count
    const createParticles = () => {
      if (!canvas || !ctx || !isActive) return;
      
      const particleCount = Math.min(150, Math.floor((canvas.width * canvas.height) / (10000 * window.devicePixelRatio)));
      particles = Array.from({ length: particleCount }, () => new Particle());
    };

    // Mouse move handler
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePosition = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    // Mouse leave handler
    const handleMouseLeave = () => {
      mousePosition = { x: null, y: null };
    };

    // Animation loop with improved performance
    const animate = () => {
      if (!canvas || !ctx || !isActive) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw connections between nearby particles with improved performance
      const maxConnections = 3; // Limit connections per particle
      particles.forEach((particle, i) => {
        let connectionCount = 0;
        for (let j = i + 1; j < particles.length && connectionCount < maxConnections; j++) {
          const otherParticle = particles[j];
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            const opacity = 0.2 * (1 - distance / 100);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(107, 70, 193, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
            connectionCount++;
          }
        }
      });

      if (isActive) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    // Initialize
    try {
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);
      createParticles();
      animate();
    } catch (error) {
      console.error('Error initializing FloatingParticles:', error);
    }

    // Cleanup
    return () => {
      isActive = false;
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <Box
      component="canvas"
      ref={canvasRef}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default FloatingParticles; 