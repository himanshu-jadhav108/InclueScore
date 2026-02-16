/**
 * InstaLoanEligibility Component for IncluScore
 * Real-time loan eligibility checker with instant pre-approval
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error,
  TrendingUp,
  Security,
  Speed,
  Calculate,
} from '@mui/icons-material';

const InstaLoanEligibility = ({ beneficiaryData, score }) => {
  const [selectedAmount, setSelectedAmount] = useState(50000);
  const [selectedTenure, setSelectedTenure] = useState(12);
  const [eligibilityResult, setEligibilityResult] = useState(null);
  
  // Calculate eligibility based on score and profile
  const calculateEligibility = useCallback(() => {
    if (!beneficiaryData || !score) return null;
    
    const {
      monthly_income = 0,
      employment_type = 0,
      loan_repayment_status = 0,
      electricity_bill_paid_on_time = 0,
      is_high_need = false
    } = beneficiaryData;
    
    // Base eligibility factors
    let eligibilityScore = 0;
    let maxLoanAmount = 0;
    let interestRate = 18; // Default high rate
    let status = 'rejected';
    let reasons = [];
    let benefits = [];
    
    // Score-based eligibility (40% weightage)
    if (score >= 700) {
      eligibilityScore += 40;
      maxLoanAmount += 200000;
      interestRate = 12;
      benefits.push('Premium interest rates');
    } else if (score >= 600) {
      eligibilityScore += 30;
      maxLoanAmount += 150000;
      interestRate = 15;
      benefits.push('Standard interest rates');
    } else if (score >= 500) {
      eligibilityScore += 20;
      maxLoanAmount += 75000;
      interestRate = 17;
      reasons.push('Credit score below 600');
    } else {
      eligibilityScore += 10;
      maxLoanAmount += 25000;
      reasons.push('Low credit score requires improvement');
    }
    
    // Employment-based eligibility (25% weightage)
    if (employment_type === 2) { // Salaried
      eligibilityScore += 25;
      maxLoanAmount += monthly_income * 10;
      benefits.push('Stable salaried employment');
    } else if (employment_type === 1) { // Self-employed
      eligibilityScore += 20;
      maxLoanAmount += monthly_income * 6;
      benefits.push('Self-employment income verified');
    } else {
      eligibilityScore += 5;
      reasons.push('Employment status needs verification');
    }
    
    // Income-based eligibility (20% weightage)
    if (monthly_income >= 25000) {
      eligibilityScore += 20;
      maxLoanAmount += 100000;
      benefits.push('High income bracket');
    } else if (monthly_income >= 15000) {
      eligibilityScore += 15;
      maxLoanAmount += 50000;
      benefits.push('Good income level');
    } else if (monthly_income >= 10000) {
      eligibilityScore += 10;
      benefits.push('Adequate income');
    } else {
      eligibilityScore += 5;
      reasons.push('Income below minimum threshold');
    }
    
    // Payment history (15% weightage)
    if (loan_repayment_status === 1 && electricity_bill_paid_on_time === 1) {
      eligibilityScore += 15;
      maxLoanAmount += 75000;
      benefits.push('Excellent payment history');
      interestRate = Math.max(interestRate - 2, 10);
    } else if (loan_repayment_status === 1 || electricity_bill_paid_on_time === 1) {
      eligibilityScore += 10;
      benefits.push('Good payment track record');
      interestRate = Math.max(interestRate - 1, 11);
    } else {
      eligibilityScore += 5;
      reasons.push('Payment history needs improvement');
    }
    
    // Determine final status
    if (eligibilityScore >= 80) {
      status = 'approved';
    } else if (eligibilityScore >= 60) {
      status = 'conditional';
      reasons.push('May require additional documentation');
    } else {
      status = 'rejected';
    }
    
    // Calculate EMI
    const monthlyRate = interestRate / 100 / 12;
    const emi = selectedAmount * monthlyRate * Math.pow(1 + monthlyRate, selectedTenure) / 
                (Math.pow(1 + monthlyRate, selectedTenure) - 1);
    
    // Check if requested amount is within limit
    const requestedAmountEligible = selectedAmount <= maxLoanAmount;
    if (!requestedAmountEligible) {
      reasons.push(`Requested amount exceeds limit of ₹${maxLoanAmount.toLocaleString()}`);
      if (status === 'approved') status = 'conditional';
    }
    
    return {
      status,
      eligibilityScore,
      maxLoanAmount: Math.min(maxLoanAmount, 500000), // Cap at 5 lakh
      interestRate,
      emi: Math.round(emi),
      requestedAmount: selectedAmount,
      tenure: selectedTenure,
      reasons,
      benefits,
      processingTime: status === 'approved' ? '24 hours' : status === 'conditional' ? '3-5 days' : 'N/A'
    };
  }, [beneficiaryData, score, selectedAmount, selectedTenure]);
  
  useEffect(() => {
    const result = calculateEligibility();
    setEligibilityResult(result);
  }, [calculateEligibility]);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'conditional': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle />;
      case 'conditional': return <Warning />;
      case 'rejected': return <Error />;
      default: return null;
    }
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Instantly Approved';
      case 'conditional': return 'Conditional Approval';
      case 'rejected': return 'Not Eligible';
      default: return 'Unknown';
    }
  };
  
  if (!beneficiaryData) {
    return (
      <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
        <Typography variant="h6" color="textSecondary">
          Loan eligibility data not available
        </Typography>
      </Paper>
    );
  }
  
  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
        <Speed sx={{ verticalAlign: 'middle', mr: 1 }} />
        Insta Loan Eligibility
      </Typography>
      
      <Typography variant="body2" color="textSecondary" paragraph>
        Get instant pre-approval for personal loans
      </Typography>
      
      <Divider sx={{ mb: 3 }} />
      
      {/* Loan Configuration */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Loan Amount: ₹{selectedAmount.toLocaleString()}
          </Typography>
          <Slider
            value={selectedAmount}
            min={10000}
            max={500000}
            step={10000}
            onChange={(e, value) => setSelectedAmount(value)}
            marks={[
              { value: 10000, label: '₹10K' },
              { value: 100000, label: '₹1L' },
              { value: 300000, label: '₹3L' },
              { value: 500000, label: '₹5L' },
            ]}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `₹${(value / 1000)}K`}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Loan Tenure</InputLabel>
            <Select
              value={selectedTenure}
              label="Loan Tenure"
              onChange={(e) => setSelectedTenure(e.target.value)}
            >
              <MenuItem value={6}>6 months</MenuItem>
              <MenuItem value={12}>12 months</MenuItem>
              <MenuItem value={18}>18 months</MenuItem>
              <MenuItem value={24}>24 months</MenuItem>
              <MenuItem value={36}>36 months</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      
      {/* Eligibility Result */}
      {eligibilityResult && (
        <Box>
          {/* Status Header */}
          <Card 
            sx={{ 
              mb: 2,
              bgcolor: `${getStatusColor(eligibilityResult.status)}.50`,
              border: `2px solid`,
              borderColor: `${getStatusColor(eligibilityResult.status)}.main`
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={1}>
                {getStatusIcon(eligibilityResult.status)}
                <Typography variant="h6" fontWeight="bold" color={`${getStatusColor(eligibilityResult.status)}.main`}>
                  {getStatusText(eligibilityResult.status)}
                </Typography>
              </Box>
              
              {eligibilityResult.status === 'approved' && (
                <Chip 
                  label={`Processing: ${eligibilityResult.processingTime}`} 
                  color="success" 
                  size="small" 
                />
              )}
            </CardContent>
          </Card>
          
          {/* Loan Details */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center" p={1.5} bgcolor="grey.50" borderRadius={1}>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  ₹{Math.round(eligibilityResult.emi).toLocaleString()}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Monthly EMI
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Box textAlign="center" p={1.5} bgcolor="grey.50" borderRadius={1}>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {eligibilityResult.interestRate}%
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Interest Rate
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Box textAlign="center" p={1.5} bgcolor="grey.50" borderRadius={1}>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  ₹{eligibilityResult.maxLoanAmount.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Max Eligible
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Box textAlign="center" p={1.5} bgcolor="grey.50" borderRadius={1}>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {eligibilityResult.eligibilityScore}%
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Eligibility Score
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          {/* Eligibility Progress */}
          <Box mb={3}>
            <Typography variant="body2" gutterBottom>
              Eligibility Score: {eligibilityResult.eligibilityScore}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={eligibilityResult.eligibilityScore}
              color={getStatusColor(eligibilityResult.status)}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
          
          {/* Benefits */}
          {eligibilityResult.benefits.length > 0 && (
            <Box mb={2}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="success.main">
                <CheckCircle sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1rem' }} />
                Benefits
              </Typography>
              <List dense>
                {eligibilityResult.benefits.map((benefit, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <CheckCircle color="success" sx={{ fontSize: '1rem' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={benefit} 
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
          
          {/* Issues/Requirements */}
          {eligibilityResult.reasons.length > 0 && (
            <Box mb={2}>
              <Typography 
                variant="subtitle2" 
                fontWeight="bold" 
                gutterBottom 
                color={eligibilityResult.status === 'rejected' ? 'error.main' : 'warning.main'}
              >
                <Warning sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1rem' }} />
                {eligibilityResult.status === 'rejected' ? 'Issues to Address' : 'Requirements'}
              </Typography>
              <List dense>
                {eligibilityResult.reasons.map((reason, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <Warning color={eligibilityResult.status === 'rejected' ? 'error' : 'warning'} sx={{ fontSize: '1rem' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={reason} 
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
          
          {/* Action Button */}
          <Box textAlign="center" mt={3}>
            {eligibilityResult.status === 'approved' ? (
              <Button 
                variant="contained" 
                color="success" 
                size="large" 
                startIcon={<Security />}
                fullWidth
              >
                Apply for Instant Loan
              </Button>
            ) : eligibilityResult.status === 'conditional' ? (
              <Button 
                variant="contained" 
                color="warning" 
                size="large" 
                startIcon={<Calculate />}
                fullWidth
              >
                Apply with Documentation
              </Button>
            ) : (
              <Button 
                variant="outlined" 
                color="primary" 
                size="large" 
                startIcon={<TrendingUp />}
                fullWidth
              >
                Improve Score & Reapply
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default InstaLoanEligibility;