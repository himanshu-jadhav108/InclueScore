/**
 * AnimatedBueafeaftton Component
 * Enhanced button with smooth animations and ripple effects
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@mui/material';

const AnimatedButton = ({ 
  children,
  gradient = false,
  ...props 
}) => {
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    tap: { 
      scale: 0.95,
      transition: {
        duration: 0.1,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const gradientStyle = gradient ? {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    '&:hover': {
      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
      boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
    }
  } : {};

  return (
    <motion.div
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      style={{ display: 'inline-block' }}
    >
      <Button
        sx={{
          borderRadius: 2,
          px: 3,
          py: 1,
          fontWeight: 600,
          textTransform: 'none',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          ...gradientStyle,
          ...props.sx
        }}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
};

export default AnimatedButton;
