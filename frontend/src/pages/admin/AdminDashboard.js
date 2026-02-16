/**
 * Admin Dashboard for IncluScore
 * Comprehensive admin interface for system management
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
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Timeline as TimelineIcon,
  AccountCircle,
  Logout,
  TrendingUp,
  Warning,
  CheckCircle,
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
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
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

const AdminDashboard = () => {
  const { dbUser, userDisplayName } = useUserContext();
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dashboard data
  const [systemStats, setSystemStats] = useState({
    totalBeneficiaries: 0,
    totalUsers: 0,
    systemHealth: 'Unknown',
    activeLoans: 0,
  });
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [healthData, setHealthData] = useState(null);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load system health
      const health = await getHealthStatus();
      setHealthData(health);

      // Load beneficiaries
      const beneficiaryData = await getAllBeneficiaries();
      setBeneficiaries(beneficiaryData.beneficiaries || []);

      // Calculate system stats
      setSystemStats({
        totalBeneficiaries: beneficiaryData.total || 0,
        totalUsers: beneficiaryData.beneficiaries?.length || 0,
        systemHealth: health.status || 'Unknown',
        activeLoans: beneficiaryData.beneficiaries?.filter(b => b.credit_score > 600).length || 0,
      });

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
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
            IncluScore - Admin Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              icon={<SecurityIcon />}
              label="Admin"
              color="secondary"
              variant="outlined"
            />
            <Typography variant="body2">
              Welcome, {userDisplayName}
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
        {/* System Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <PeopleIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Beneficiaries
                    </Typography>
                    <Typography variant="h4">
                      {systemStats.totalBeneficiaries}
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
                  <TrendingUp color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Eligible for Loans
                    </Typography>
                    <Typography variant="h4">
                      {systemStats.activeLoans}
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
                  <CheckCircle color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      System Health
                    </Typography>
                    <Typography variant="h6">
                      {systemStats.systemHealth}
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
                  <TimelineIcon color="info" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Database Records
                    </Typography>
                    <Typography variant="h4">
                      {healthData?.total_beneficiaries || 0}
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
            <Tab icon={<AssessmentIcon />} label="System Overview" />
            <Tab icon={<PeopleIcon />} label="User Management" />
            <Tab icon={<TimelineIcon />} label="Analytics" />
            <Tab icon={<SettingsIcon />} label="System Settings" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <TabPanel value={currentTab} index={0}>
          {/* System Overview */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Beneficiaries
                  </Typography>
                  <List>
                    {beneficiaries.slice(0, 5).map((beneficiary, index) => (
                      <React.Fragment key={beneficiary.id}>
                        <ListItem>
                          <ListItemIcon>
                            <AccountCircle />
                          </ListItemIcon>
                          <ListItemText
                            primary={beneficiary.name || 'Unknown'}
                            secondary={`Score: ${beneficiary.credit_score || 'N/A'} | Risk: ${beneficiary.risk_category || 'N/A'}`}
                          />
                          <Chip
                            label={beneficiary.credit_score >= 700 ? 'Excellent' : 
                                   beneficiary.credit_score >= 600 ? 'Good' : 'Needs Improvement'}
                            color={beneficiary.credit_score >= 700 ? 'success' : 
                                   beneficiary.credit_score >= 600 ? 'primary' : 'warning'}
                            size="small"
                          />
                        </ListItem>
                        {index < 4 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                  <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                    View All Beneficiaries
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    System Status
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Database" secondary="Connected" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText primary="ML Model" secondary="Active" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText primary="API Server" secondary="Running" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          {/* User Management */}
          <Typography variant="h6" gutterBottom>
            User Management
          </Typography>
          <Typography variant="body1" color="textSecondary">
            User management features will be implemented here, including:
            • Create new users
            • Assign roles and permissions
            • Manage user access
            • View user activity logs
          </Typography>
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          {/* Analytics */}
          <Typography variant="h6" gutterBottom>
            System Analytics
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Advanced analytics and reporting features will be implemented here, including:
            • Credit score trends
            • Risk assessment reports
            • Model performance metrics
            • Business intelligence dashboards
          </Typography>
        </TabPanel>

        <TabPanel value={currentTab} index={3}>
          {/* System Settings */}
          <Typography variant="h6" gutterBottom>
            System Configuration
          </Typography>
          <Typography variant="body1" color="textSecondary">
            System configuration options will be implemented here, including:
            • ML model parameters
            • Scoring thresholds
            • Business rules configuration
            • Integration settings
          </Typography>
        </TabPanel>
      </Container>
    </Box>
  );
};

export default AdminDashboard;