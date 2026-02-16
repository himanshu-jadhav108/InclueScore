/**
 * Enhanced Beneficiary Dashboard for IncluScore
 * Modern dashboard with animated tabs and polished UI
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Chip,
  Paper,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  History as HistoryIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';

// Import API functions and components
import { getBeneficiaryByEmail, getScoreHistory } from '../../api/api';
import { useUser } from '@clerk/clerk-react';
import ScoreGauge from '../../components/ScoreGauge';
import BeneficiaryProfile from '../../components/BeneficiaryProfile';
import RiskMatrix from '../../components/RiskMatrix';
import ScoreSimulator from '../../components/ScoreSimulator';
import InstaLoanEligibility from '../../components/InstaLoanEligibility';
import NavigationBar from '../../components/NavigationBar';
import AnimatedCard from '../../components/AnimatedCard';
import LoadingScreen from '../../components/LoadingScreen';

// Tab panel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`beneficiary-tabpanel-${index}`}
      aria-labelledby={`beneficiary-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const BeneficiaryDashboard = () => {
  const { user } = useUser();
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Beneficiary data
  const [beneficiaryData, setBeneficiaryData] = useState(null);
  const [scoreHistory, setScoreHistory] = useState([]);

  // Load beneficiary data
  useEffect(() => {
    const loadData = async () => {
      if (user?.emailAddresses?.[0]?.emailAddress) {
        setLoading(true);
        setError(null);

        try {
          const email = user.emailAddresses[0].emailAddress;
          
          // Load beneficiary profile
          const beneficiary = await getBeneficiaryByEmail(email);
          console.log('Loaded beneficiary data:', beneficiary); // Debug log
          setBeneficiaryData(beneficiary);

          // Load score history if beneficiary exists
          if (beneficiary?.id) {
            try {
              const history = await getScoreHistory(beneficiary.id);
              setScoreHistory(history.history || []);
            } catch (historyErr) {
              console.warn('Score history not available:', historyErr);
              setScoreHistory([]);
            }
          }

        } catch (err) {
          console.error('Error loading beneficiary data:', err);
          setError('Unable to load your profile. Please contact support if this persists.');
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [user]);

  const loadBeneficiaryData = async () => {
    if (user?.emailAddresses?.[0]?.emailAddress) {
      setLoading(true);
      setError(null);

      try {
        const email = user.emailAddresses[0].emailAddress;
        
        // Load beneficiary profile
        const beneficiary = await getBeneficiaryByEmail(email);
        setBeneficiaryData(beneficiary);

        // Load score history if beneficiary exists
        if (beneficiary?.id) {
          try {
            const history = await getScoreHistory(beneficiary.id);
            setScoreHistory(history.history || []);
          } catch (historyErr) {
            console.warn('Score history not available:', historyErr);
            setScoreHistory([]);
          }
        }

      } catch (err) {
        console.error('Error loading beneficiary data:', err);
        setError('Unable to load your profile. Please contact support if this persists.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const getScoreLevel = (score) => {
    if (score >= 750) return { level: 'Excellent', color: 'success', icon: CheckCircleIcon };
    if (score >= 700) return { level: 'Very Good', color: 'success', icon: CheckCircleIcon };
    if (score >= 650) return { level: 'Good', color: 'primary', icon: TrendingUpIcon };
    if (score >= 600) return { level: 'Fair', color: 'warning', icon: WarningIcon };
    return { level: 'Needs Improvement', color: 'error', icon: ErrorIcon };
  };

  if (loading) {
    return <LoadingScreen message="Loading your dashboard..." />;
  }

  if (error) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              sx={{
                p: 4,
                borderRadius: 4,
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                }}
              >
                <ErrorIcon sx={{ fontSize: 48, color: 'white' }} />
              </Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Error Loading Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {error}
              </Typography>
              <Button 
                variant="contained" 
                onClick={loadBeneficiaryData}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                }}
              >
                Try Again
              </Button>
            </Paper>
          </motion.div>
        </Container>
      </Box>
    );
  }

  if (!beneficiaryData) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              sx={{
                p: 4,
                borderRadius: 4,
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                }}
              >
                <WarningIcon sx={{ fontSize: 48, color: 'white' }} />
              </Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Profile Not Found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                We couldn't find your beneficiary profile. Please contact support to set up your account.
              </Typography>
            </Paper>
          </motion.div>
        </Container>
      </Box>
    );
  }

  const currentScore = beneficiaryData.credit_score || 0;
  const scoreLevel = getScoreLevel(currentScore);

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Navigation Bar */}
      <NavigationBar />

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box 
            sx={{ 
              mb: 4, 
              textAlign: 'center',
              p: 4,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
            }}
          >
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Welcome Back!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.95, mb: 2 }}>
              {beneficiaryData.name || `Beneficiary #${beneficiaryData.beneficiary_id}`}
            </Typography>
            <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
              <Chip 
                label={`Credit Score: ${currentScore}`}
                sx={{
                  fontSize: '1.1rem',
                  px: 3,
                  py: 2.5,
                  height: 'auto',
                  bgcolor: 'white',
                  color: scoreLevel.color === 'success' ? '#10b981' : scoreLevel.color === 'warning' ? '#f59e0b' : '#ef4444',
                  fontWeight: 700,
                }}
              />
              <Chip 
                label={scoreLevel.level}
                sx={{
                  fontSize: '1rem',
                  px: 3,
                  py: 2.5,
                  height: 'auto',
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                }}
              />
            </Box>
          </Box>
        </motion.div>

        {/* Main Dashboard Layout */}
        
        {/* Top Row: Beneficiary Profile (Left) + Score Simulator (Right) */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} lg={6}>
            <AnimatedCard delay={0.1} hover>
              <BeneficiaryProfile
                beneficiaryData={beneficiaryData}
                score={currentScore}
                riskCategory={beneficiaryData?.risk_category}
                explanation={beneficiaryData?.explanation || `This beneficiary has a credit score of ${currentScore} based on their financial history and behavior patterns. The assessment considers factors such as loan repayment history, utility bill payments, employment status, and overall financial stability.`}
              />
            </AnimatedCard>
          </Grid>
          
          <Grid item xs={12} lg={6}>
            <AnimatedCard delay={0.2} hover={false}>
              <ScoreSimulator
                currentData={beneficiaryData}
                currentScore={currentScore}
              />
            </AnimatedCard>
          </Grid>
        </Grid>

        {/* Bottom Row: Score Gauge + Risk Matrix (Left) + Insta Loan Eligibility (Right) */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} lg={6}>
            <Grid container spacing={3} sx={{ height: '100%' }}>
              <Grid item xs={12} md={6}>
                <AnimatedCard delay={0.3} hover>
                  <ScoreGauge 
                    score={currentScore} 
                    maxScore={900}
                    minScore={300}
                  />
                </AnimatedCard>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <AnimatedCard delay={0.4} hover>
                  <RiskMatrix
                    riskCategory={beneficiaryData?.risk_category}
                    score={beneficiaryData?.credit_score || currentScore}
                  />
                </AnimatedCard>
              </Grid>
            </Grid>
          </Grid>
          
          <Grid item xs={12} lg={6}>
            <AnimatedCard delay={0.5} hover={false}>
              <InstaLoanEligibility
                beneficiaryData={beneficiaryData}
                score={currentScore}
              />
            </AnimatedCard>
          </Grid>
        </Grid>

        {/* Additional Sections - Tabs for extra information */}
        <Paper elevation={3} sx={{ mt: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ px: 2 }}
            >
              <Tab icon={<HistoryIcon />} label="Score History" />
              <Tab icon={<AssessmentIcon />} label="Recommendations" />
              <Tab icon={<TrendingUpIcon />} label="Financial Insights" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <TabPanel value={currentTab} index={0}>
            {/* Score History */}
            <Typography variant="h6" gutterBottom>
              Credit Score History & Trends
            </Typography>
            {scoreHistory.length > 0 ? (
              <List>
                {scoreHistory.slice(0, 10).map((entry, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>
                        <TimelineIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={`Score: ${entry.score || 'N/A'}`}
                        secondary={entry.scored_at ? 
                          new Date(entry.scored_at).toLocaleDateString() : 
                          'Unknown date'
                        }
                      />
                      <Chip
                        label={entry.score >= 700 ? 'Excellent' : entry.score >= 600 ? 'Good' : entry.score >= 500 ? 'Fair' : 'Poor'}
                        color={entry.score >= 700 ? 'success' : entry.score >= 600 ? 'primary' : entry.score >= 500 ? 'warning' : 'error'}
                        size="small"
                      />
                    </ListItem>
                    {index < scoreHistory.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Alert severity="info">
                <Typography variant="body1">
                  No score history available yet. Your score will be tracked as it updates over time.
                </Typography>
              </Alert>
            )}
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            {/* Personalized Recommendations */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="success.main">
                      <CheckCircleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Strengths to Maintain
                    </Typography>
                    <List>
                      {beneficiaryData?.loan_repayment_status === 1 && (
                        <ListItem>
                          <ListItemText
                            primary="Excellent loan repayment history"
                            secondary="Continue making payments on time to maintain your score"
                          />
                        </ListItem>
                      )}
                      {beneficiaryData?.electricity_bill_paid_on_time === 1 && (
                        <ListItem>
                          <ListItemText
                            primary="Timely utility bill payments"
                            secondary="Your consistent bill payments show financial responsibility"
                          />
                        </ListItem>
                      )}
                      {beneficiaryData?.employment_type === 2 && (
                        <ListItem>
                          <ListItemText
                            primary="Stable employment"
                            secondary="Your salaried employment provides income stability"
                          />
                        </ListItem>
                      )}
                      {beneficiaryData?.monthly_income >= 20000 && (
                        <ListItem>
                          <ListItemText
                            primary="Good income level"
                            secondary="Your income supports loan eligibility"
                          />
                        </ListItem>
                      )}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary.main">
                      <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Areas for Improvement
                    </Typography>
                    <List>
                      {beneficiaryData?.loan_repayment_status === 0 && (
                        <ListItem>
                          <ListItemText
                            primary="Improve loan repayment behavior"
                            secondary="Focus on making all future payments on time"
                          />
                        </ListItem>
                      )}
                      {beneficiaryData?.electricity_bill_paid_on_time === 0 && (
                        <ListItem>
                          <ListItemText
                            primary="Set up automatic bill payments"
                            secondary="Automate utility payments to avoid late fees"
                          />
                        </ListItem>
                      )}
                      {beneficiaryData?.mobile_recharge_frequency < 3 && (
                        <ListItem>
                          <ListItemText
                            primary="Increase mobile recharge frequency"
                            secondary="Regular recharges show active financial behavior"
                          />
                        </ListItem>
                      )}
                      {beneficiaryData?.employment_type === 0 && (
                        <ListItem>
                          <ListItemText
                            primary="Seek stable employment"
                            secondary="Steady income improves creditworthiness"
                          />
                        </ListItem>
                      )}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={currentTab} index={2}>
            {/* Financial Insights */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary" fontWeight="bold">
                      {currentScore}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      Current Credit Score
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(currentScore / 900) * 100}
                      sx={{ mt: 2, height: 8, borderRadius: 4 }}
                      color={scoreLevel.color}
                    />
                    <Typography variant="caption" color="textSecondary" display="block" mt={1}>
                      {scoreLevel.level} Rating
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main" fontWeight="bold">
                      ₹{beneficiaryData?.monthly_income?.toLocaleString() || '0'}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      Monthly Income
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Employment: {
                        beneficiaryData?.employment_type === 2 ? 'Salaried' :
                        beneficiaryData?.employment_type === 1 ? 'Self-employed' :
                        'Unemployed'
                      }
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main" fontWeight="bold">
                      {beneficiaryData?.risk_category?.split(' - ')[0] || 'Unknown'}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      Risk Level
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Need Level: {beneficiaryData?.is_high_need ? 'High' : 'Low'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
};

export default BeneficiaryDashboard;