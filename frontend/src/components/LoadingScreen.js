/**
 * LoadingScreen Component
 * Modern loading screen with animated spinner
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { Dashboard as DashboardIcon } from '@mui/icons-material';

const LoadingScreen = ({ message = 'Loading...' }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  const iconVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background animation */}
        <motion.div
          variants={pulseVariants}
          animate="animate"
          style={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            filter: 'blur(40px)'
          }}
        />

        {/* Loading icon */}
        <motion.div
          variants={iconVariants}
          animate="animate"
        >
          <DashboardIcon
            sx={{
              fontSize: 80,
              color: 'white',
              mb: 3,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
            }}
          />
        </motion.div>

        {/* Loading text */}
        <Typography
          variant="h5"
          sx={{
            color: 'white',
            fontWeight: 600,
            mb: 2
          }}
        >
          {message}
        </Typography>

        {/* Progress dots */}
        <Box display="flex" gap={1}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -10, 0],
                transition: {
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2
                }
              }}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: 'white'
              }}
            />
          ))}
        </Box>
      </Box>
    </motion.div>
  );
};

export default LoadingScreen;
