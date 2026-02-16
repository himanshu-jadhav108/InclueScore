/**
 * RiskMatrix Component for IncluScore
 * Displays a 2x2 risk-need matrix highlighting the beneficiary's category
 */

import React from 'react';
import { Box, Typography, Paper, Grid, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import AssessmentIcon from '@mui/icons-material/Assessment';

const MatrixCell = styled(Paper)(({ theme, isActive, cellColor }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  height: 100,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  border: isActive ? `3px solid ${cellColor}` : `1px solid rgba(102, 126, 234, 0.2)`,
  backgroundColor: isActive ? `${cellColor}20` : 'rgba(255, 255, 255, 0.5)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'default',
  borderRadius: '12px',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    elevation: isActive ? 8 : 2,
    transform: isActive ? 'scale(1.05)' : 'scale(1.02)',
    boxShadow: isActive 
      ? `0 8px 24px ${cellColor}40` 
      : '0 4px 12px rgba(102, 126, 234, 0.15)',
  },
}));

const RiskMatrix = ({ riskCategory, score }) => {
  // Parse the risk category string (e.g., "Low Risk - High Need")
  const parseRiskCategory = (category) => {
    if (!category) return { risk: 'Unknown', need: 'Unknown' };
    
    const parts = category.split(' - ');
    const risk = parts[0] || 'Unknown';
    const need = parts[1] || 'Unknown';
    
    return { risk, need };
  };
  
  const { risk, need } = parseRiskCategory(riskCategory);
  
  // Define matrix categories and their properties
  const matrixCategories = [
    {
      id: 'low-risk-low-need',
      risk: 'Low Risk',
      need: 'Low Need',
      color: '#4caf50',
      label: 'Stable',
      description: 'Low risk, financially stable',
      recommendation: 'Maintain current financial habits',
    },
    {
      id: 'low-risk-high-need',
      risk: 'Low Risk',
      need: 'High Need',
      color: '#2196f3',
      label: 'Prime Candidate',
      description: 'Low risk, high need for credit',
      recommendation: 'Ideal for loan approval',
    },
    {
      id: 'medium-risk-low-need',
      risk: 'Medium Risk',
      need: 'Low Need',
      color: '#ff9800',
      label: 'Monitor',
      description: 'Moderate risk, low need',
      recommendation: 'Monitor financial behavior',
    },
    {
      id: 'high-risk-low-need',
      risk: 'High Risk',
      need: 'Low Need',
      color: '#ff9800',
      label: 'Monitor',
      description: 'High risk, low need',
      recommendation: 'Monitor financial behavior',
    },
    {
      id: 'medium-risk-high-need',
      risk: 'Medium Risk',
      need: 'High Need',
      color: '#ff5722',
      label: 'Caution',
      description: 'Moderate risk, high need',
      recommendation: 'Conditional approval with guidance',
    },
    {
      id: 'high-risk-high-need',
      risk: 'High Risk',
      need: 'High Need',
      color: '#f44336',
      label: 'High Risk',
      description: 'High risk, high need',
      recommendation: 'Requires financial guidance',
    },
  ];
  
  // Find the current category
  const currentCategory = matrixCategories.find(
    cat => cat.risk === risk && cat.need === need
  ) || matrixCategories.find(cat => cat.risk.includes('Medium') && cat.need === need);
  
  // Check if a cell is active
  const isCellActive = (cellRisk, cellNeed) => {
    return cellRisk === risk && cellNeed === need;
  };
  
  // Get recommendation based on score and category
  const getRecommendation = () => {
    if (currentCategory) {
      return currentCategory.recommendation;
    }
    
    if (score >= 700) {
      return 'Excellent creditworthiness - approve loans confidently';
    } else if (score >= 550) {
      return 'Good candidate - consider with standard terms';
    } else {
      return 'Requires improvement - provide financial guidance';
    }
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
        mb: 2,
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
          <AssessmentIcon sx={{ color: 'white', fontSize: 24 }} />
        </Box>
        <Typography variant="h6" color="primary" fontWeight="bold">
          Risk & Need Assessment
        </Typography>
      </Box>
      
      {/* Current category display */}
      <Box mb={3} textAlign="center">
        {currentCategory && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            <Chip
              label={currentCategory.label}
              sx={{
                backgroundColor: currentCategory.color,
                color: 'white',
                fontWeight: 700,
                fontSize: '0.95rem',
                px: 3,
                py: 2.5,
                height: 'auto',
                boxShadow: `0 4px 12px ${currentCategory.color}40`,
              }}
            />
          </motion.div>
        )}
        
        <Typography variant="body2" color="textSecondary" mt={2} fontWeight={500}>
          {riskCategory}
        </Typography>
      </Box>
      
      {/* Risk-Need Matrix */}
      <Grid container spacing={1} mb={3}>
        {/* Header row */}
        <Grid item xs={4}>
          <Box display="flex" alignItems="center" justifyContent="center" height={40}>
            <Typography variant="caption" fontWeight="bold">
              Need →
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box display="flex" alignItems="center" justifyContent="center" height={40}>
            <Typography variant="caption" fontWeight="bold" color="primary">
              Low Need
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box display="flex" alignItems="center" justifyContent="center" height={40}>
            <Typography variant="caption" fontWeight="bold" color="primary">
              High Need
            </Typography>
          </Box>
        </Grid>
        
        {/* Low Risk row */}
        <Grid item xs={4}>
          <Box display="flex" alignItems="center" justifyContent="center" height={80}>
            <Typography 
              variant="caption" 
              fontWeight="bold" 
              color="primary"
              sx={{ transform: 'rotate(-90deg)', whiteSpace: 'nowrap' }}
            >
              Low Risk
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <MatrixCell
            isActive={isCellActive('Low Risk', 'Low Need')}
            cellColor="#4caf50"
            elevation={isCellActive('Low Risk', 'Low Need') ? 6 : 1}
          >
            <Typography variant="caption" fontWeight="bold">
              Stable
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Monitor
            </Typography>
          </MatrixCell>
        </Grid>
        <Grid item xs={4}>
          <MatrixCell
            isActive={isCellActive('Low Risk', 'High Need')}
            cellColor="#2196f3"
            elevation={isCellActive('Low Risk', 'High Need') ? 6 : 1}
          >
            <Typography variant="caption" fontWeight="bold">
              Prime
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Approve
            </Typography>
          </MatrixCell>
        </Grid>
        
        {/* High Risk row */}
        <Grid item xs={4}>
          <Box display="flex" alignItems="center" justifyContent="center" height={80}>
            <Typography 
              variant="caption" 
              fontWeight="bold" 
              color="primary"
              sx={{ transform: 'rotate(-90deg)', whiteSpace: 'nowrap' }}
            >
              High Risk
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <MatrixCell
            isActive={isCellActive('High Risk', 'Low Need') || isCellActive('Medium Risk', 'Low Need')}
            cellColor="#ff9800"
            elevation={isCellActive('High Risk', 'Low Need') || isCellActive('Medium Risk', 'Low Need') ? 6 : 1}
          >
            <Typography variant="caption" fontWeight="bold">
              Monitor
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Caution
            </Typography>
          </MatrixCell>
        </Grid>
        <Grid item xs={4}>
          <MatrixCell
            isActive={isCellActive('High Risk', 'High Need') || isCellActive('Medium Risk', 'High Need')}
            cellColor="#f44336"
            elevation={isCellActive('High Risk', 'High Need') || isCellActive('Medium Risk', 'High Need') ? 6 : 1}
          >
            <Typography variant="caption" fontWeight="bold">
              High Risk
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Guide
            </Typography>
          </MatrixCell>
        </Grid>
      </Grid>
      
      {/* Recommendation */}
      <Box 
        mt={2} 
        p={2.5}
        sx={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
          borderRadius: '12px',
          border: '1px solid rgba(102, 126, 234, 0.2)',
        }}
      >
        <Typography variant="body2" fontWeight="bold" gutterBottom color="primary">
          📋 Recommendation:
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 1.6 }}>
          {getRecommendation()}
        </Typography>
      </Box>
    </Paper>
  );
};

export default RiskMatrix;