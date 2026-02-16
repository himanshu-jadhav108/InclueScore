/**
 * Loan Officer Dashboard for IncluScore
 * Focused interface for loan assessment and beneficiary management
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
  TextField,
  InputAdornment,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  AccountBalance as AccountBalanceIcon,
  Score as ScoreIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { UserButton } from '@clerk/clerk-react';

// Import API functions and components
import { getAllBeneficiaries, getBeneficiaryById } from '../../api/api';
import { useUserContext } from '../../contexts/UserContext';
import ScoreGauge from '../../components/ScoreGauge';

// Tab panel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`loan-officer-tabpanel-${index}`}
      aria-labelledby={`loan-officer-tab-${index}`}
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

const LoanOfficerDashboard = () => {
  const { userDisplayName } = useUserContext();
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dashboard data
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [filteredBeneficiaries, setFilteredBeneficiaries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  
  // Statistics
  const [stats, setStats] = useState({
    totalBeneficiaries: 0,
    highRiskCount: 0,
    mediumRiskCount: 0,
    lowRiskCount: 0,
    averageScore: 0,
  });

  // Load dashboard data
  useEffect(() => {
    loadBeneficiaries();
  }, []);

  // Filter beneficiaries based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = beneficiaries.filter(b => 
        (b.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.id || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBeneficiaries(filtered);
    } else {
      setFilteredBeneficiaries(beneficiaries);
    }
  }, [searchTerm, beneficiaries]);

  const loadBeneficiaries = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllBeneficiaries();
      const beneficiaryList = data.beneficiaries || [];
      setBeneficiaries(beneficiaryList);
      setFilteredBeneficiaries(beneficiaryList);

      // Calculate statistics
      const total = beneficiaryList.length;
      const high = beneficiaryList.filter(b => (b.risk_category || '').toLowerCase() === 'high').length;
      const medium = beneficiaryList.filter(b => (b.risk_category || '').toLowerCase() === 'medium').length;
      const low = beneficiaryList.filter(b => (b.risk_category || '').toLowerCase() === 'low').length;
      const avgScore = total > 0 ? beneficiaryList.reduce((sum, b) => sum + (b.credit_score || 0), 0) / total : 0;

      setStats({
        totalBeneficiaries: total,
        highRiskCount: high,
        mediumRiskCount: medium,
        lowRiskCount: low,
        averageScore: Math.round(avgScore),
      });

    } catch (err) {
      console.error('Error loading beneficiaries:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleViewBeneficiary = async (beneficiaryId) => {
    try {
      const data = await getBeneficiaryById(beneficiaryId);
      setSelectedBeneficiary(data);
      setViewDialogOpen(true);
    } catch (err) {
      console.error('Error loading beneficiary details:', err);
      setError(err.message);
    }
  };

  const getRiskColor = (risk) => {
    switch ((risk || '').toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 700) return 'success';
    if (score >= 600) return 'warning';
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
          <AssessmentIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Loan Officer Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              icon={<AccountBalanceIcon />}
              label="Loan Officer"
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
          <Button color="inherit" size="small" onClick={loadBeneficiaries} sx={{ ml: 2 }}>
            Retry
          </Button>
        </Alert>
      )}

      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        {/* Statistics Cards */}
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
                      {stats.totalBeneficiaries}
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
                  <ScoreIcon color="info" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Average Score
                    </Typography>
                    <Typography variant="h4">
                      {stats.averageScore}
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
                  <WarningIcon color="error" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      High Risk
                    </Typography>
                    <Typography variant="h4">
                      {stats.highRiskCount}
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
                  <CheckCircleIcon color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Low Risk
                    </Typography>
                    <Typography variant="h4">
                      {stats.lowRiskCount}
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
            <Tab icon={<PeopleIcon />} label="Beneficiary List" />
            <Tab icon={<TrendingUpIcon />} label="Risk Assessment" />
            <Tab icon={<AssessmentIcon />} label="Loan Evaluation" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <TabPanel value={currentTab} index={0}>
          {/* Beneficiary List */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search beneficiaries by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell align="center">Credit Score</TableCell>
                  <TableCell align="center">Risk Category</TableCell>
                  <TableCell align="center">Last Updated</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBeneficiaries.map((beneficiary) => (
                  <TableRow key={beneficiary.id}>
                    <TableCell>
                      <Typography variant="body1">
                        {beneficiary.name || 'Unknown'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {beneficiary.email || 'N/A'}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={beneficiary.credit_score || 'N/A'}
                        color={getScoreColor(beneficiary.credit_score)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={beneficiary.risk_category || 'Unknown'}
                        color={getRiskColor(beneficiary.risk_category)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {beneficiary.updated_at ? 
                        new Date(beneficiary.updated_at).toLocaleDateString() : 
                        'N/A'
                      }
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleViewBeneficiary(beneficiary.id)}
                        size="small"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredBeneficiaries.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="textSecondary">
                No beneficiaries found
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {searchTerm ? 'Try adjusting your search criteria' : 'Add new beneficiaries to get started'}
              </Typography>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          {/* Risk Assessment */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="error">
                    High Risk ({stats.highRiskCount})
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Beneficiaries requiring immediate attention and close monitoring
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="warning.main">
                    Medium Risk ({stats.mediumRiskCount})
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Beneficiaries with moderate risk factors
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="success.main">
                    Low Risk ({stats.lowRiskCount})
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Beneficiaries with good credit standing
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          {/* Loan Evaluation */}
          <Typography variant="h6" gutterBottom>
            Loan Evaluation Tools
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Advanced loan evaluation features will be implemented here, including:
            • Loan eligibility assessment
            • Risk-based pricing
            • Approval workflow management
            • Document verification
          </Typography>
        </TabPanel>
      </Container>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add beneficiary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => console.log('Add new beneficiary')}
      >
        <PersonAddIcon />
      </Fab>

      {/* Beneficiary Details Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Beneficiary Details
        </DialogTitle>
        <DialogContent>
          {selectedBeneficiary && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <Typography><strong>Name:</strong> {selectedBeneficiary.name || 'N/A'}</Typography>
                <Typography><strong>Email:</strong> {selectedBeneficiary.email || 'N/A'}</Typography>
                <Typography><strong>Age:</strong> {selectedBeneficiary.age || 'N/A'}</Typography>
                <Typography><strong>Gender:</strong> {selectedBeneficiary.gender || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Credit Information
                </Typography>
                <Box display="flex" alignItems="center" mb={2}>
                  <ScoreGauge score={selectedBeneficiary.credit_score || 0} size={120} />
                </Box>
                <Typography><strong>Risk Category:</strong> 
                  <Chip
                    label={selectedBeneficiary.risk_category || 'Unknown'}
                    color={getRiskColor(selectedBeneficiary.risk_category)}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>
            Close
          </Button>
          <Button variant="contained" color="primary">
            Edit Details
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoanOfficerDashboard;