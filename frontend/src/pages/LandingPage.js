/**
 * Enhanced Landing Page for IncluScore
 * Modern, animated landing page with gradient backgrounds and smooth interactions
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  AppBar,
  Toolbar,
  Stack,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrendingUp,
  Security,
  Speed,
  Lightbulb,
  Login,
  PersonAdd,
  ArrowForward,
  Star,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import AnimatedCard from '../components/AnimatedCard';
import AnimatedButton from '../components/AnimatedButton';
import GradientBackground from '../components/GradientBackground';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <TrendingUp sx={{ fontSize: 48 }} />,
      title: 'Dynamic Credit Scoring',
      description: 'Real-time credit assessment with ML-powered scoring engine that adapts and learns continuously.',
      color: '#667eea',
    },
    {
      icon: <Lightbulb sx={{ fontSize: 48 }} />,
      title: 'Score Simulator',
      description: 'Interactive "What-If" tool showing how future actions can improve credit scores.',
      color: '#f59e0b',
    },
    {
      icon: <Security sx={{ fontSize: 48 }} />,
      title: 'Risk Assessment',
      description: 'Intelligent risk-need matrix for automated loan approval decisions.',
      color: '#10b981',
    },
    {
      icon: <Speed sx={{ fontSize: 48 }} />,
      title: 'Instant Processing',
      description: 'Get credit scores and explanations in real-time with our high-performance API.',
      color: '#ef4444',
    },
  ];

  const stats = [
    { value: '99.9%', label: 'Accuracy' },
    { value: '<100ms', label: 'Response Time' },
    { value: '10K+', label: 'Assessments' },
    { value: '24/7', label: 'Availability' },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', overflow: 'hidden', background: '#1a1a1a' }}>
      {/* Modern Navigation Bar */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          background: 'rgba(26, 26, 26, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          color: 'white',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
              }}
            >
              <DashboardIcon sx={{ color: 'white' }} />
            </Box>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              IncluScore
            </Typography>
          </motion.div>
          
          <SignedOut>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Stack direction="row" spacing={2}>
                <Button
                  onClick={() => navigate('/login')}
                  startIcon={<Login />}
                  sx={{ 
                    color: 'white',
                    fontWeight: 600,
                  }}
                >
                  Login
                </Button>
                <AnimatedButton
                  variant="contained"
                  gradient
                  onClick={() => navigate('/signup')}
                  startIcon={<PersonAdd />}
                >
                  Get Started
                </AnimatedButton>
              </Stack>
            </motion.div>
          </SignedOut>
          
          <SignedIn>
            <Stack direction="row" spacing={2} alignItems="center">
              <AnimatedButton
                variant="contained"
                gradient
                onClick={() => navigate('/dashboard')}
                startIcon={<DashboardIcon />}
              >
                Dashboard
              </AnimatedButton>
              <UserButton afterSignOutUrl="/" />
            </Stack>
          </SignedIn>
        </Toolbar>
      </AppBar>

      {/* Hero Section with Gradient Background */}
      <GradientBackground variant="primary" animated sx={{ py: { xs: 8, md: 12 }, background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <Box display="flex" alignItems="center" mb={3}>
                    <Box
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: 20,
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Star sx={{ fontSize: 16, color: '#fbbf24' }} />
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                        AI-Powered Credit Assessment
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Typography 
                    variant="h2" 
                    fontWeight="bold" 
                    gutterBottom
                    sx={{
                      color: 'white',
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      lineHeight: 1.2,
                      textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    }}
                  >
                    Dynamic Credit Scoring
                    <br />
                    <Box component="span" sx={{ 
                      background: 'linear-gradient(to right, #fbbf24, #f59e0b)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      & Guidance System
                    </Box>
                  </Typography>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 4, 
                      color: 'rgba(255, 255, 255, 0.95)',
                      fontSize: { xs: '1.1rem', md: '1.25rem' },
                      lineHeight: 1.6,
                    }}
                  >
                    Transform financial inclusion with real-time credit assessment,
                    personalized guidance, and ML-powered insights.
                  </Typography>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <SignedOut>
                      <AnimatedButton
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/signup')}
                        endIcon={<ArrowForward />}
                        sx={{
                          background: 'white',
                          color: '#667eea',
                          px: 4,
                          py: 1.5,
                          fontSize: '1.1rem',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.95)',
                          },
                        }}
                      >
                        Start Free Trial
                      </AnimatedButton>
                      
                      <AnimatedButton
                        variant="outlined"
                        size="large"
                        onClick={() => navigate('/login')}
                        startIcon={<Login />}
                        sx={{
                          borderColor: 'white',
                          color: 'white',
                          px: 4,
                          py: 1.5,
                          fontSize: '1.1rem',
                          '&:hover': { 
                            borderColor: 'white', 
                            background: 'rgba(255,255,255,0.1)',
                          },
                        }}
                      >
                        Login
                      </AnimatedButton>
                    </SignedOut>
                    
                    <SignedIn>
                      <AnimatedButton
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/dashboard')}
                        endIcon={<ArrowForward />}
                        sx={{
                          background: 'white',
                          color: '#667eea',
                          px: 4,
                          py: 1.5,
                          fontSize: '1.1rem',
                        }}
                      >
                        Go to Dashboard
                      </AnimatedButton>
                    </SignedIn>
                  </Stack>
                </motion.div>
              </motion.div>
            </Grid>

            {/* Floating illustration */}
            <Grid item xs={12} md={5}>
              <motion.div variants={floatingVariants} animate="animate">
                <Box
                  sx={{
                    position: 'relative',
                    height: { xs: 300, md: 400 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 4,
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <DashboardIcon sx={{ fontSize: 120, color: 'rgba(255, 255, 255, 0.5)' }} />
                    
                    {/* Animated circles */}
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: i * 1,
                        }}
                        style={{
                          position: 'absolute',
                          width: 200 + i * 40,
                          height: 200 + i * 40,
                          borderRadius: '50%',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Grid container spacing={3} sx={{ mt: 6 }}>
              {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 3,
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <Typography 
                      variant="h3" 
                      fontWeight="bold"
                      sx={{ color: 'white', mb: 1 }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography 
                      variant="body1"
                      sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </GradientBackground>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, background: '#0f0f0f' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Box textAlign="center" mb={8}>
            <Typography 
              variant="h3" 
              fontWeight="bold" 
              gutterBottom
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Powerful Features
            </Typography>
            <Typography 
              variant="h6" 
              color="rgba(255, 255, 255, 0.7)"
              sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}
            >
              Everything you need to revolutionize credit assessment
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <AnimatedCard delay={index * 0.1} hover>
                <Box sx={{ p: 3, textAlign: 'center', height: '100%', background: '#1a1a1a' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${feature.color}20 0%, ${feature.color}40 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 24px',
                      color: feature.color,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant="h6" 
                    fontWeight="bold" 
                    gutterBottom
                    sx={{ color: 'white' }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="rgba(255, 255, 255, 0.6)"
                    sx={{ lineHeight: 1.7 }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
              </AnimatedCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ background: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)', py: { xs: 8, md: 10 } }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box
              sx={{
                textAlign: 'center',
                p: { xs: 4, md: 6 },
                borderRadius: 4,
                background: '#0f0f0f',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(102, 126, 234, 0.2)',
              }}
            >
              <Typography 
                variant="h3" 
                fontWeight="bold" 
                gutterBottom
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Ready to Get Started?
              </Typography>
              
              <Typography 
                variant="h6" 
                color="rgba(255, 255, 255, 0.7)" 
                paragraph
                sx={{ mt: 2, mb: 4 }}
              >
                Join thousands of organizations transforming credit assessment
              </Typography>
              
              <SignedOut>
                <AnimatedButton
                  variant="contained"
                  size="large"
                  gradient
                  onClick={() => navigate('/signup')}
                  endIcon={<ArrowForward />}
                  sx={{ px: 5, py: 2, fontSize: '1.1rem' }}
                >
                  Start Free Trial
                </AnimatedButton>
              </SignedOut>
              
              <SignedIn>
                <AnimatedButton
                  variant="contained"
                  size="large"
                  gradient
                  onClick={() => navigate('/dashboard')}
                  endIcon={<DashboardIcon />}
                  sx={{ px: 5, py: 2, fontSize: '1.1rem' }}
                >
                  Access Dashboard
                </AnimatedButton>
              </SignedIn>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 4,
          px: 2,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center">
              <DashboardIcon sx={{ mr: 1 }} />
              <Typography variant="body1" fontWeight="bold">
                IncluScore
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              © 2025 IncluScore. Powered by AI & Machine Learning
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Built for Social Impact & Financial Inclusion
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;