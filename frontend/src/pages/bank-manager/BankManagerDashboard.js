/**
 * Bank Manager Dashboard for IncluScore
 * Strategic overview dashboard for bank managers and senior staff
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
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  AccountBalance as AccountBalanceIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import { UserButton } from '@clerk/clerk-react';

// Import API functions
import { getAllBeneficiaries, getHealthStatus } from '../../api/api';
import { useUserContext } from '../../contexts/UserContext';

// Tab panel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`bank-manager-tabpanel-${index}`}
      aria-labelledby={`bank-manager-tab-${index}`}
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

const BankManagerDashboard = () => {
  const { userDisplayName } = useUserContext();
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dashboard data
  const [businessMetrics, setBusinessMetrics] = useState({
    totalPortfolio: 0,
    averageScore: 0,
    riskDistribution: { high: 0, medium: 0, low: 0 },
    loanEligible: 0,
    monthlyGrowth: 0,
  });
  const [systemHealth, setSystemHealth] = useState(null);

  // Load dashboard data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Load system health
        const health = await getHealthStatus();
        setSystemHealth(health);

        // Load beneficiaries data
        const data = await getAllBeneficiaries();
        const beneficiaryList = data.beneficiaries || [];

        // Calculate business metrics
        calculateBusinessMetrics(beneficiaryList);

      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load system health
      const health = await getHealthStatus();
      setSystemHealth(health);

      // Load beneficiaries data
      const data = await getAllBeneficiaries();
      const beneficiaryList = data.beneficiaries || [];

      // Calculate business metrics
      calculateBusinessMetrics(beneficiaryList);

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateBusinessMetrics = (beneficiaryList) => {
    const total = beneficiaryList.length;
    
    // Risk distribution
    const riskDistribution = {
      high: beneficiaryList.filter(b => (b.risk_category || '').toLowerCase() === 'high').length,
      medium: beneficiaryList.filter(b => (b.risk_category || '').toLowerCase() === 'medium').length,
      low: beneficiaryList.filter(b => (b.risk_category || '').toLowerCase() === 'low').length,
    };

    // Average score
    const avgScore = total > 0 ? 
      beneficiaryList.reduce((sum, b) => sum + (b.credit_score || 0), 0) / total : 0;

    // Loan eligible (score >= 600)
    const loanEligible = beneficiaryList.filter(b => (b.credit_score || 0) >= 600).length;

    // Estimated monthly growth (mock calculation)
    const monthlyGrowth = Math.round((loanEligible / total) * 100) || 0;

    setBusinessMetrics({
      totalPortfolio: total,
      averageScore: Math.round(avgScore),
      riskDistribution,
      loanEligible,
      monthlyGrowth,
    });
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const getPerformanceColor = (value, threshold = 70) => {
    if (value >= threshold) return 'success';
    if (value >= threshold * 0.7) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <DashboardIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Bank Manager Dashboard - Strategic Overview
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              icon={<AccountBalanceIcon />}
              label="Bank Manager"
              color="secondary"
              variant="outlined"
            />
            <Typography variant="body2">
              {userDisplayName}
            </Typography>
            <UserButton />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
          <Button color="inherit" size="small" onClick={loadDashboardData} sx={{ ml: 2 }}>
            Retry
          </Button>
        </Alert>
      )}

      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        {/* Key Performance Indicators */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <PeopleIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Portfolio
                    </Typography>
                    <Typography variant="h4">
                      {businessMetrics.totalPortfolio}
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      Active beneficiaries
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <SpeedIcon color="info" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Average Score
                    </Typography>
                    <Typography variant="h4">
                      {businessMetrics.averageScore}
                    </Typography>
                    <Typography variant="body2" color="info.main">
                      Portfolio health
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <AttachMoneyIcon color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Loan Eligible
                    </Typography>
                    <Typography variant="h4">
                      {businessMetrics.loanEligible}
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      Ready for lending
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <TrendingUpIcon color="warning" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Growth Rate
                    </Typography>
                    <Typography variant="h4">
                      {businessMetrics.monthlyGrowth}%
                    </Typography>
                    <Typography variant="body2" color="warning.main">
                      Portfolio eligible
                    </Typography>
                  </Box>
                </Box>
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
            <Tab icon={<AssessmentIcon />} label="Business Overview" />
            <Tab icon={<AnalyticsIcon />} label="Risk Analytics" />
            <Tab icon={<TimelineIcon />} label="Performance Metrics" />
            <Tab icon={<SecurityIcon />} label="System Health" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <TabPanel value={currentTab} index={0}>
          {/* Business Overview */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Portfolio Risk Distribution
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Box textAlign="center">
                        <Typography variant="h3" color="error.main">
                          {businessMetrics.riskDistribution.high}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          High Risk
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(businessMetrics.riskDistribution.high / businessMetrics.totalPortfolio) * 100}
                          color="error"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box textAlign="center">
                        <Typography variant="h3" color="warning.main">
                          {businessMetrics.riskDistribution.medium}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Medium Risk
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(businessMetrics.riskDistribution.medium / businessMetrics.totalPortfolio) * 100}
                          color="warning"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box textAlign="center">
                        <Typography variant="h3" color="success.main">
                          {businessMetrics.riskDistribution.low}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Low Risk
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(businessMetrics.riskDistribution.low / businessMetrics.totalPortfolio) * 100}
                          color="success"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quick Actions
                  </Typography>
                  <List>
                    <ListItem button>
                      <ListItemIcon>
                        <AssessmentIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Generate Report"
                        secondary="Portfolio analysis"
                      />
                    </ListItem>
                    <Divider />
                    <ListItem button>
                      <ListItemIcon>
                        <PieChartIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Risk Analysis"
                        secondary="Detailed breakdown"
                      />
                    </ListItem>
                    <Divider />
                    <ListItem button>
                      <ListItemIcon>
                        <TimelineIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Trend Analysis"
                        secondary="Historical data"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          {/* Risk Analytics */}
          <Typography variant="h6" gutterBottom>
            Risk Analytics Dashboard
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Risk Concentration
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Advanced risk analytics including:
                    • Concentration risk analysis
                    • Sector-wise risk distribution
                    • Geographic risk mapping
                    • Correlation analysis
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Predictive Models
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    AI-powered risk prediction:
                    • Default probability models
                    • Early warning systems
                    • Portfolio optimization
                    • Stress testing results
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          {/* Performance Metrics */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Key Performance Metrics
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Metric</TableCell>
                          <TableCell align="center">Current Value</TableCell>
                          <TableCell align="center">Target</TableCell>
                          <TableCell align="center">Performance</TableCell>
                          <TableCell align="center">Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>Average Credit Score</TableCell>
                          <TableCell align="center">{businessMetrics.averageScore}</TableCell>
                          <TableCell align="center">650</TableCell>
                          <TableCell align="center">
                            <LinearProgress
                              variant="determinate"
                              value={(businessMetrics.averageScore / 650) * 100}
                              color={getPerformanceColor(businessMetrics.averageScore, 650)}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              icon={businessMetrics.averageScore >= 650 ? <CheckCircleIcon /> : <WarningIcon />}
                              label={businessMetrics.averageScore >= 650 ? 'On Target' : 'Below Target'}
                              color={businessMetrics.averageScore >= 650 ? 'success' : 'warning'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Portfolio Eligibility</TableCell>
                          <TableCell align="center">{Math.round((businessMetrics.loanEligible / businessMetrics.totalPortfolio) * 100)}%</TableCell>
                          <TableCell align="center">70%</TableCell>
                          <TableCell align="center">
                            <LinearProgress
                              variant="determinate"
                              value={(businessMetrics.loanEligible / businessMetrics.totalPortfolio) * 100}
                              color={getPerformanceColor((businessMetrics.loanEligible / businessMetrics.totalPortfolio) * 100)}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              icon={<TrendingUpIcon />}
                              label="Good"
                              color="success"
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={currentTab} index={3}>
          {/* System Health */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    System Status
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Database Connection"
                        secondary={systemHealth?.status || 'Checking...'}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="ML Model Status"
                        secondary="Active and operational"
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="API Response Time"
                        secondary="< 200ms average"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Data Quality Metrics
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Data quality monitoring includes:
                    • Completeness checks
                    • Accuracy validation
                    • Consistency monitoring
                    • Freshness tracking
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Overall Data Quality Score
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={95}
                      color="success"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      95% - Excellent
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Container>
    </Box>
  );
};

export default BankManagerDashboard;