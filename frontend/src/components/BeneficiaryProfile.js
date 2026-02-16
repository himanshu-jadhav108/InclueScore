/**
 * BeneficiaryProfile Component for IncluScore
 * Displays comprehensive beneficiary information and profile details
 */

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Person,
  Work,
  AttachMoney,
  CreditCard,
  ElectricBolt,
  Phone,
  CalendarToday,
  TrendingUp,
  AccountCircle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const BeneficiaryProfile = ({ beneficiaryData, score, riskCategory, explanation }) => {
  if (!beneficiaryData) {
    return (
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          height: '100%',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(102, 126, 234, 0.1)',
          borderRadius: '16px',
        }}
      >
        <Typography variant="h6" color="textSecondary">
          No beneficiary data available
        </Typography>
      </Paper>
    );
  }
  
  // Helper function to format employment type
  const getEmploymentType = (type) => {
    switch (type) {
      case 0: return { label: 'Unemployed', color: 'error' };
      case 1: return { label: 'Self-employed', color: 'warning' };
      case 2: return { label: 'Salaried', color: 'success' };
      default: return { label: 'Unknown', color: 'default' };
    }
  };
  
  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Helper function to get status color
  const getStatusColor = (status) => {
    return status === 1 ? 'success' : 'error';
  };
  
  // Helper function to get status text
  const getStatusText = (status) => {
    return status === 1 ? 'Yes' : 'No';
  };
  
  const employment = getEmploymentType(beneficiaryData.employment_type);
  
  // Generate initials for avatar
  const getInitials = (id) => {
    return `B${id}`;
  };
  
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        height: '100%',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(102, 126, 234, 0.1)',
        borderRadius: '16px',
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: 1,
        mb: 3,
      }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AccountCircle sx={{ color: 'white', fontSize: 24 }} />
        </Box>
        <Typography variant="h6" color="primary" fontWeight="bold">
          Beneficiary Profile
        </Typography>
      </Box>
      
      {/* Header section with avatar and basic info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Box 
          display="flex" 
          alignItems="center" 
          mb={3}
          p={2}
          sx={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
            borderRadius: '12px',
            border: '1px solid rgba(102, 126, 234, 0.1)',
          }}
        >
          <Avatar
            sx={{
              width: 64,
              height: 64,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            }}
          >
            {getInitials(beneficiaryData.beneficiary_id || 'ID')}
          </Avatar>
          
          <Box ml={2} flex={1}>
            <Typography variant="h6" fontWeight="bold">
              Beneficiary #{beneficiaryData.beneficiary_id || 'Unknown'}
            </Typography>
            
            <Box display="flex" gap={1} mt={1} flexWrap="wrap">
              <Chip
                label={employment.label}
                color={employment.color}
                size="small"
                sx={{ fontWeight: 600 }}
              />
              
              <Chip
                label={beneficiaryData.is_high_need === 1 ? 'High Need' : 'Low Need'}
                color={beneficiaryData.is_high_need === 1 ? 'secondary' : 'default'}
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Box>
          </Box>
        </Box>
      </motion.div>
      
      <Divider sx={{ mb: 3, opacity: 0.3 }} />
      
      {/* Detailed information */}
      <List dense>
        {/* Age */}
        <ListItem>
          <ListItemIcon>
            <Person color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Age"
            secondary={`${beneficiaryData.age || 'Unknown'} years`}
          />
        </ListItem>
        
        {/* Employment */}
        <ListItem>
          <ListItemIcon>
            <Work color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Employment"
            secondary={employment.label}
          />
        </ListItem>
        
        {/* Monthly Income */}
        <ListItem>
          <ListItemIcon>
            <AttachMoney color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Monthly Income"
            secondary={formatCurrency(beneficiaryData.monthly_income || 0)}
          />
        </ListItem>
        
        {/* Loan Repayment Status */}
        <ListItem>
          <ListItemIcon>
            <CreditCard color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Loan Repayment History"
            secondary={
              <Chip
                label={getStatusText(beneficiaryData.loan_repayment_status)}
                color={getStatusColor(beneficiaryData.loan_repayment_status)}
                size="small"
              />
            }
          />
        </ListItem>
        
        {/* Loan Tenure */}
        <ListItem>
          <ListItemIcon>
            <CalendarToday color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Loan Tenure"
            secondary={`${beneficiaryData.loan_tenure_months || 0} months`}
          />
        </ListItem>
        
        {/* Electricity Bill Payment */}
        <ListItem>
          <ListItemIcon>
            <ElectricBolt color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Utility Bill Payments"
            secondary={
              <Chip
                label={getStatusText(beneficiaryData.electricity_bill_paid_on_time)}
                color={getStatusColor(beneficiaryData.electricity_bill_paid_on_time)}
                size="small"
              />
            }
          />
        </ListItem>
        
        {/* Mobile Recharge Frequency */}
        <ListItem>
          <ListItemIcon>
            <Phone color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Mobile Recharge Frequency"
            secondary={`${beneficiaryData.mobile_recharge_frequency || 0} times/month`}
          />
        </ListItem>
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Current Status Summary */}
      <Box>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary" sx={{ mb: 2 }}>
          Current Assessment
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Box 
                textAlign="center" 
                p={2}
                sx={{
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                  borderRadius: '12px',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                }}
              >
                <Typography variant="h4" fontWeight="bold" sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {score}
                </Typography>
                <Typography variant="caption" color="textSecondary" fontWeight={600}>
                  IncluScore
                </Typography>
              </Box>
            </motion.div>
          </Grid>
          
          <Grid item xs={6}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Box 
                textAlign="center" 
                p={2}
                sx={{
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                  borderRadius: '12px',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                }}
              >
                <Typography variant="body1" fontWeight="bold">
                  {riskCategory?.split(' - ')[0] || 'Unknown'}
                </Typography>
                <Typography variant="caption" color="textSecondary" fontWeight={600}>
                  Risk Level
                </Typography>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
      
      {/* AI Explanation */}
      {explanation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Box mt={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <TrendingUp sx={{ color: 'primary.main' }} />
              <Typography variant="subtitle2" fontWeight="bold" color="primary">
                AI Analysis
              </Typography>
            </Box>
            
            <Box
              p={2.5}
              sx={{
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                borderRadius: '12px',
                border: '1px solid rgba(102, 126, 234, 0.2)',
              }}
            >
              <Typography variant="body2" lineHeight={1.7} color="text.secondary">
                {explanation}
              </Typography>
            </Box>
          </Box>
        </motion.div>
      )}
    </Paper>
  );
};

export default BeneficiaryProfile;