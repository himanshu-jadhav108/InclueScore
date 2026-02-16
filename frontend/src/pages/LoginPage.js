/**
 * Enhanced Login Page for IncluScore
 * Modern glass morphism design with animated backgrounds
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
} from '@mui/material';
import {
  SignIn,
  SignedIn,
  SignedOut,
  useUser,
} from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Dashboard as DashboardIcon } from '@mui/icons-material';
import GradientBackground from '../components/GradientBackground';
import AnimatedButton from '../components/AnimatedButton';

const LoginPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  // Redirect to dashboard if already signed in
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <GradientBackground variant="primary" animated>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          position: 'relative',
        }}
      >
        {/* Animated background elements */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '10%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
              }}
            >
              <SignedOut>
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Box mb={4}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                      }}
                    >
                      <DashboardIcon
                        sx={{
                          fontSize: 48,
                          color: 'white',
                        }}
                      />
                    </Box>
                    <Typography 
                      variant="h4" 
                      fontWeight="bold" 
                      gutterBottom
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Welcome Back
                    </Typography>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      IncluScore
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Sign in to access the credit scoring dashboard
                    </Typography>
                  </Box>
                </motion.div>

                {/* Clerk Sign In Component */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Box display="flex" justifyContent="center">
                    <SignIn
                      appearance={{
                        elements: {
                          rootBox: {
                            width: '100%',
                          },
                          card: {
                            boxShadow: 'none',
                            border: 'none',
                          },
                        },
                      }}
                      redirectUrl="/dashboard"
                      signUpUrl="/signup"
                    />
                  </Box>
                </motion.div>
              </SignedOut>

              <SignedIn>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box>
                    <DashboardIcon
                      sx={{
                        fontSize: 80,
                        color: 'primary.main',
                        mb: 2,
                      }}
                    />
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                      Welcome back!
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      Redirecting to dashboard...
                    </Typography>
                    <AnimatedButton
                      variant="contained"
                      gradient
                      onClick={() => navigate('/dashboard')}
                      startIcon={<DashboardIcon />}
                      sx={{ mt: 2 }}
                    >
                      Go to Dashboard
                    </AnimatedButton>
                  </Box>
                </motion.div>
              </SignedIn>
            </Paper>
          </motion.div>

          {/* Back to home link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Box textAlign="center" mt={3}>
              <Button
                onClick={() => navigate('/')}
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                ← Back to Home
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </GradientBackground>
  );
};

export default LoginPage;