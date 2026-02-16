/**
 * GradientBackground Component
 * Animated gradient background with floating orbs
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';

const GradientBackground = ({ 
  variant = 'primary',
  children,
  animated = true,
  ...props 
}) => {
  const gradients = {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    warm: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    cool: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
  };

  const orbVariants = {
    animate: {
      x: [0, 100, 0],
      y: [0, -100, 0],
      scale: [1, 1.2, 1],
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        background: gradients[variant] || gradients.primary,
        overflow: 'hidden',
        ...props.sx
      }}
      {...props}
    >
      {/* Animated floating orbs */}
      {animated && (
        <>
          <motion.div
            variants={orbVariants}
            animate="animate"
            style={{
              position: 'absolute',
              top: '10%',
              left: '10%',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              filter: 'blur(40px)',
              pointerEvents: 'none'
            }}
          />
          <motion.div
            variants={orbVariants}
            animate="animate"
            style={{
              position: 'absolute',
              bottom: '10%',
              right: '10%',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
              animationDelay: '10s'
            }}
          />
        </>
      )}
      
      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {children}
      </Box>
    </Box>
  );
};

export default GradientBackground;
