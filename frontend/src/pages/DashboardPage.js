/**
 * Enhanced DashboardPage Component for IncluScore
 * Modern dashboard with animated cards and improved layout
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Grid,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  AppBar,
  Toolbar,
  Paper,
  Chip,
  Stack,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  MonetizationOn,
  Refresh,
  Person,
  TrendingUp,
} from '@mui/icons-material';
import { useUser, UserButton } from '@clerk/clerk-react';

// Import components
import ScoreGauge from '../components/ScoreGauge';
import RiskMatrix from '../components/RiskMatrix';
import BeneficiaryProfile from '../components/BeneficiaryProfile';
import ScoreSimulator from '../components/ScoreSimulator';
import AnimatedCard from '../components/AnimatedCard';
import AnimatedButton from '../components/AnimatedButton';
import LoadingScreen from '../components/LoadingScreen';

// Import API functions
import { getBeneficiary, getAllBeneficiaries } from '../api/api';

const DashboardPage = () => {
  const { user } = useUser();
  
  // State management
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState(1);
  const [beneficiaryData, setBeneficiaryData] = useState(null);
  const [beneficiariesList, setBeneficiariesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Beneficiary details
  const [score, setScore] = useState(0);
  const [riskCategory, setRiskCategory] = useState('');
  const [explanation, setExplanation] = useState('');
  
  // Load beneficiaries list
  const loadBeneficiariesList = useCallback(async () => {
    try {
      const data = await getAllBeneficiaries();
      setBeneficiariesList(data.beneficiaries || []);
      
      // Auto-select first beneficiary if none selected
      if (data.beneficiaries && data.beneficiaries.length > 0 && !selectedBeneficiaryId) {
        setSelectedBeneficiaryId(data.beneficiaries[0].id);
      }
    } catch (err) {
      console.error('Error loading beneficiaries list:', err);
      setError('Failed to load beneficiaries list');
    }
  }, [selectedBeneficiaryId]);
  
  // Load all beneficiaries on component mount
  useEffect(() => {
    loadBeneficiariesList();
  }, [loadBeneficiariesList]);
  
  // Load specific beneficiary when selection changes
  useEffect(() => {
    if (selectedBeneficiaryId) {
      loadBeneficiaryData(selectedBeneficiaryId);
    }
  }, [selectedBeneficiaryId]);
  
  // Load beneficiary data
  const loadBeneficiaryData = async (beneficiaryId) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getBeneficiary(beneficiaryId);
      
      setBeneficiaryData({
        beneficiary_id: data.id,
        ...data.data,
      });
      setScore(data.score);
      setRiskCategory(data.risk_category);
      setExplanation(data.explanation);
      
    } catch (err) {
      console.error('Error loading beneficiary data:', err);
      setError(`Failed to load beneficiary data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle beneficiary selection change
  const handleBeneficiaryChange = (event) => {
    setSelectedBeneficiaryId(event.target.value);
  };
  
  // Handle refresh
  const handleRefresh = () => {
    if (selectedBeneficiaryId) {
      loadBeneficiaryData(selectedBeneficiaryId);
    }
  };
  
  // Check if Insta-Loan should be enabled
  const isInstaLoanEligible = () => {
    return riskCategory === 'Low Risk - High Need';
  };
  
  // Handle Insta-Loan approval
  const handleInstaLoan = () => {
    alert(`🎉 Insta-Loan Approved for Beneficiary #${selectedBeneficiaryId}!\n\nLoan Details:\n• Amount: ₹50,000\n• Interest Rate: 8.5% p.a.\n• Tenure: 12 months\n• Processing: Instant`);
  };
  
  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Modern App Bar */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
              }}
            >
              <DashboardIcon sx={{ color: 'white' }} />
            </Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: 'white' }}>
              Credit Scoring Dashboard
            </Typography>
          </motion.div>
          
          <Box sx={{ flexGrow: 1 }} />
          
          {/* User Welcome Message */}
          {user && (
            <Typography 
              variant="body2" 
              sx={{ 
                mr: 2, 
                color: 'rgba(255,255,255,0.9)',
                display: { xs: 'none', md: 'block' }
              }}
            >
              Welcome, {user.firstName || user.emailAddresses[0]?.emailAddress}
            </Typography>
          )}
          
          {/* Beneficiary Selector */}
          <FormControl 
            variant="outlined" 
            size="small"
            sx={{ 
              minWidth: 200, 
              mr: 2,
              display: { xs: 'none', sm: 'block' }
            }}
          >
            <InputLabel sx={{ color: 'rgba(255,255,255,0.9)' }}>Select Beneficiary</InputLabel>
            <Select
              value={selectedBeneficiaryId}
              onChange={handleBeneficiaryChange}
              label="Select Beneficiary"
              sx={{ 
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '& .MuiSvgIcon-root': {
                  color: 'white',
                },
              }}
            >
              {beneficiariesList.map((beneficiary) => (
                <MenuItem key={beneficiary.id} value={beneficiary.id}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Person fontSize="small" />
                    Beneficiary #{beneficiary.id}
                    <Chip
                      label={`${beneficiary.score}`}
                      size="small"
                      sx={{
                        bgcolor: beneficiary.score >= 650 ? '#10b981' : '#f59e0b',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    />
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <AnimatedButton
            onClick={handleRefresh}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Refresh />}
            sx={{
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.2)',
              },
              mr: 2,
            }}
          >
            Refresh
          </AnimatedButton>
          
          {/* User Button from Clerk */}
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-10 h-10 rounded-lg",
              },
            }}
          />
        </Toolbar>
      </AppBar>
      
      {/* Main Content */}
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
              }} 
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          </motion.div>
        )}
        
        {/* Loading State */}
        {loading && (
          <LoadingScreen message="Loading beneficiary data..." />
        )}
        
        {/* Dashboard Content */}
        {!loading && beneficiaryData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Grid container spacing={3}>
              {/* Left Column */}
              <Grid item xs={12} lg={6}>
                <Grid container spacing={3}>
                  {/* Beneficiary Profile */}
                  <Grid item xs={12}>
                    <AnimatedCard delay={0.1} hover>
                      <BeneficiaryProfile
                        beneficiaryData={beneficiaryData}
                        score={score}
                        riskCategory={riskCategory}
                        explanation={explanation}
                      />
                    </AnimatedCard>
                  </Grid>
                  
                  {/* Score Gauge */}
                  <Grid item xs={12} md={6}>
                    <AnimatedCard delay={0.2} hover>
                      <ScoreGauge score={score} />
                    </AnimatedCard>
                  </Grid>
                  
                  {/* Risk Matrix */}
                  <Grid item xs={12} md={6}>
                    <AnimatedCard delay={0.3} hover>
                      <RiskMatrix riskCategory={riskCategory} score={score} />
                    </AnimatedCard>
                  </Grid>
                  
                  {/* Insta-Loan Section */}
                  <Grid item xs={12}>
                    <AnimatedCard delay={0.4} hover={false}>
                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 3,
                          background: isInstaLoanEligible() 
                            ? 'linear-gradient(135deg, #10b98120 0%, #4ade8020 100%)'
                            : 'linear-gradient(135deg, #f59e0b20 0%, #ef444420 100%)',
                          border: '1px solid',
                          borderColor: isInstaLoanEligible() ? '#10b981' : '#f59e0b',
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 2,
                              background: isInstaLoanEligible()
                                ? 'linear-gradient(135deg, #10b981 0%, #4ade80 100%)'
                                : 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <MonetizationOn sx={{ color: 'white', fontSize: 28 }} />
                          </Box>
                          <Box>
                            <Typography variant="h6" fontWeight="bold">
                              Insta-Loan Eligibility
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Instant approval for qualified beneficiaries
                            </Typography>
                          </Box>
                        </Stack>
                        
                        <Box mb={2}>
                          <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <Typography variant="body2" fontWeight="600" color="text.secondary">
                              Status:
                            </Typography>
                            <Chip
                              label={isInstaLoanEligible() ? '✓ Eligible' : '✗ Not Eligible'}
                              sx={{
                                bgcolor: isInstaLoanEligible() ? '#10b981' : '#ef4444',
                                color: 'white',
                                fontWeight: 700,
                                px: 1,
                              }}
                            />
                          </Box>
                          
                          {isInstaLoanEligible() && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              <Alert 
                                severity="success" 
                                sx={{ 
                                  mb: 2,
                                  borderRadius: 2,
                                  border: '1px solid #10b981',
                                }}
                              >
                                <strong>Congratulations!</strong> This beneficiary qualifies for instant loan approval.
                              </Alert>
                            </motion.div>
                          )}
                          
                          {!isInstaLoanEligible() && (
                            <Alert 
                              severity="info" 
                              sx={{ 
                                mb: 2,
                                borderRadius: 2,
                              }}
                            >
                              This beneficiary needs to improve their profile to qualify.
                              Use the simulator to see what changes would help.
                            </Alert>
                          )}
                        </Box>
                        
                        <AnimatedButton
                          variant="contained"
                          size="large"
                          fullWidth
                          disabled={!isInstaLoanEligible()}
                          onClick={handleInstaLoan}
                          startIcon={<MonetizationOn />}
                          gradient={isInstaLoanEligible()}
                          sx={{
                            fontWeight: 'bold',
                            py: 1.5,
                            background: !isInstaLoanEligible() ? '#94a3b8' : undefined,
                          }}
                        >
                          {isInstaLoanEligible() ? 'Approve Insta-Loan' : 'Insta-Loan Not Available'}
                        </AnimatedButton>
                        
                        {isInstaLoanEligible() && (
                          <Typography 
                            variant="caption" 
                            color="text.secondary" 
                            display="block" 
                            textAlign="center" 
                            mt={1}
                            sx={{ fontWeight: 500 }}
                          >
                            Instant approval • ₹50,000 • 8.5% p.a. • 12 months
                          </Typography>
                        )}
                      </Paper>
                    </AnimatedCard>
                  </Grid>
                </Grid>
              </Grid>
              
              {/* Right Column - Score Simulator */}
              <Grid item xs={12} lg={6}>
                <AnimatedCard delay={0.5} hover={false}>
                  <ScoreSimulator
                    currentData={beneficiaryData}
                    currentScore={score}
                  />
                </AnimatedCard>
              </Grid>
            </Grid>
          </motion.div>
        )}
        
        {/* No Data State */}
        {!loading && !beneficiaryData && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box 
              textAlign="center" 
              py={12}
              sx={{
                background: 'white',
                borderRadius: 4,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                }}
              >
                <TrendingUp sx={{ fontSize: 40, color: '#667eea' }} />
              </Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                No Data Available
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
                Please select a beneficiary from the dropdown above to view their credit profile and score simulation.
              </Typography>
            </Box>
          </motion.div>
        )}
      </Container>
      
      {/* Modern Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            IncluScore - Dynamic Credit Scoring & Guidance System
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Powered by AI & Machine Learning
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default DashboardPage;