/**
 * AnimatedCard Component
 * Modern card component with smooth animations and hover effects
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@mui/material';

const AnimatedCard = ({ 
  children, 
  delay = 0, 
  hover = true,
  sx = {},
  ...props 
}) => {
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: delay,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const hoverEffect = hover ? {
    y: -8,
    scale: 1.02,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  } : undefined;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={hoverEffect}
      style={{ height: '100%' }}
    >
      <Card
        elevation={3}
        sx={{
          height: '100%',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,1) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          ...sx
        }}
        {...props}
      >
        {children}
      </Card>
    </motion.div>
  );
};

export default AnimatedCard;
