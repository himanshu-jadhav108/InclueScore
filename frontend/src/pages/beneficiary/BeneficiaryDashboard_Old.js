/**
 * Beneficiary Dashboard for IncluScore
 * Personal dashboard for beneficiaries to view their credit profile
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
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
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
  History as HistoryIcon,
  Assessment as AssessmentIcon,
  AccountCircle as AccountCircleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Timeline as TimelineIcon,
  Home as HomeIcon,
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

  const getRiskColor = (risk) => {
    switch ((risk || '').toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getScoreLevel = (score) => {
    if (score >= 750) return { level: 'Excellent', color: 'success', icon: CheckCircleIcon };
    if (score >= 700) return { level: 'Very Good', color: 'success', icon: CheckCircleIcon };
    if (score >= 650) return { level: 'Good', color: 'primary', icon: TrendingUpIcon };
    if (score >= 600) return { level: 'Fair', color: 'warning', icon: WarningIcon };
    return { level: 'Needs Improvement', color: 'error', icon: ErrorIcon };
  };

  const getScoreAdvice = (score) => {
    if (score >= 750) return "Excellent credit score! You qualify for the best loan terms.";
    if (score >= 700) return "Very good credit score. You're eligible for most loan products.";
    if (score >= 650) return "Good credit score. Consider improving it for better loan terms.";
    if (score >= 600) return "Fair credit score. Focus on building your credit history.";
    return "Your credit score needs improvement. Follow our recommendations to boost it.";
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          {error}
          <Button color="inherit" size="small" onClick={loadBeneficiaryData} sx={{ ml: 2 }}>
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!beneficiaryData) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">
          <Typography variant="h6" gutterBottom>
            Profile Not Found
          </Typography>
          <Typography>
            We couldn't find your beneficiary profile. Please contact support to set up your account.
          </Typography>
        </Alert>
      </Container>
    );
  }

  const currentScore = beneficiaryData.credit_score || 0;
  const scoreLevel = getScoreLevel(currentScore);
  const ScoreLevelIcon = scoreLevel.icon;

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Navigation Bar */}
      <NavigationBar />

      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        {/* Credit Score Overview */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Your Credit Score
                </Typography>
                <ScoreGauge score={currentScore} size={180} />
                <Box sx={{ mt: 2 }}>
                  <Chip
                    icon={<ScoreLevelIcon />}
                    label={scoreLevel.level}
                    color={scoreLevel.color}
                    sx={{ fontSize: '1rem', px: 2, py: 1 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Score Analysis
                </Typography>
                <Typography variant="body1" paragraph>
                  {getScoreAdvice(currentScore)}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Risk Category
                  </Typography>
                  <Chip
                    label={beneficiaryData.risk_category || 'Not Assessed'}
                    color={getRiskColor(beneficiaryData.risk_category)}
                    size="medium"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Score Range Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(currentScore / 850) * 100}
                    sx={{ height: 8, borderRadius: 4 }}
                    color={scoreLevel.color}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="caption">300</Typography>
                    <Typography variant="caption">850</Typography>
                  </Box>
                </Box>

                <Typography variant="body2" color="textSecondary">
                  Last updated: {beneficiaryData.updated_at ? 
                    new Date(beneficiaryData.updated_at).toLocaleDateString() : 
                    'Never'
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Navigation Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<PersonIcon />} label="Profile" />
            <Tab icon={<HistoryIcon />} label="Score History" />
            <Tab icon={<AssessmentIcon />} label="Recommendations" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <TabPanel value={currentTab} index={0}>
          {/* Enhanced Profile Information using BeneficiaryProfile component */}
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <BeneficiaryProfile
                beneficiaryData={beneficiaryData}
                score={beneficiaryData?.credit_score || currentScore}
                riskCategory={beneficiaryData?.risk_category}
                explanation={beneficiaryData?.explanation || `This beneficiary has a credit score of ${beneficiaryData?.credit_score || currentScore} based on their financial history and behavior patterns. The assessment considers factors such as loan repayment history, utility bill payments, employment status, and overall financial stability.`}
              />
            </Grid>
            
            <Grid item xs={12} lg={4}>
              <RiskMatrix
                riskCategory={beneficiaryData?.risk_category}
                score={beneficiaryData?.credit_score || currentScore}
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          {/* Score History */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Credit Score History
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
                          label={entry.score >= 700 ? 'Good' : entry.score >= 600 ? 'Fair' : 'Poor'}
                          color={entry.score >= 700 ? 'success' : entry.score >= 600 ? 'primary' : 'error'}
                          size="small"
                        />
                      </ListItem>
                      {index < scoreHistory.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" color="textSecondary">
                  No score history available yet. Your score will be tracked as it updates.
                </Typography>
              )}
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          {/* Recommendations */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="success.main">
                    <CheckCircleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Good Practices
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Pay bills on time"
                        secondary="Payment history is the most important factor"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Keep credit utilization low"
                        secondary="Use less than 30% of available credit"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Maintain old accounts"
                        secondary="Longer credit history improves your score"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary.main">
                    <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Improvement Tips
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Monitor your credit report"
                        secondary="Check for errors and dispute them"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Diversify credit types"
                        secondary="Have a mix of credit cards and loans"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Limit new credit applications"
                        secondary="Too many inquiries can lower your score"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Container>
    </Box>
  );
};

export default BeneficiaryDashboard;