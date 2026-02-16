/**
 * Enhanced Signup Page for IncluScore
 * Modern design with engaging animations and gradient backgrounds
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
  SignUp,
  SignedIn,
  SignedOut,
  useUser,
} from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Dashboard as DashboardIcon, PersonAdd, CheckCircle } from '@mui/icons-material';
import GradientBackground from '../components/GradientBackground';
import AnimatedButton from '../components/AnimatedButton';

const SignupPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  // Redirect to dashboard if already signed in
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const benefits = [
    'Real-time credit score assessment',
    'Personalized financial guidance',
    'AI-powered insights',
    'Instant loan eligibility check',
  ];

  return (
    <GradientBackground variant="secondary" animated>
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
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: 'absolute',
            top: '15%',
            right: '15%',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -40, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '15%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
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
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        boxShadow: '0 10px 30px rgba(245, 87, 108, 0.3)',
                      }}
                    >
                      <PersonAdd
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
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Join IncluScore
                    </Typography>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Start Your Financial Journey
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Get access to the dynamic credit scoring platform
                    </Typography>

                    {/* Benefits list */}
                    <Box 
                      sx={{ 
                        mt: 3, 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        justifyContent: 'center', 
                        gap: 1 
                      }}
                    >
                      {benefits.map((benefit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                        >
                          <Box
                            sx={{
                              px: 2,
                              py: 0.5,
                              borderRadius: 20,
                              background: 'linear-gradient(135deg, #f093fb20 0%, #f5576c20 100%)',
                              border: '1px solid rgba(240, 147, 251, 0.3)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 0.5,
                            }}
                          >
                            <CheckCircle sx={{ fontSize: 16, color: '#f5576c' }} />
                            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                              {benefit}
                            </Typography>
                          </Box>
                        </motion.div>
                      ))}
                    </Box>
                  </Box>
                </motion.div>

                {/* Clerk Sign Up Component */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Box display="flex" justifyContent="center">
                    <SignUp
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
                      signInUrl="/login"
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
                    <Box
                      sx={{
                        width: 100,
                        height: 100,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        boxShadow: '0 10px 30px rgba(74, 222, 128, 0.3)',
                      }}
                    >
                      <CheckCircle sx={{ fontSize: 60, color: 'white' }} />
                    </Box>
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                      Account created successfully!
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      Welcome to IncluScore. Redirecting to dashboard...
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
            transition={{ delay: 0.7, duration: 0.5 }}
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

export default SignupPage;