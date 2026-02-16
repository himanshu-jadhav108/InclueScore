/**
 * ScoreSimulator Component for IncluScore
 * The "killer feature" - Interactive "What-If" tool for score simulation
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Alert,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  Calculate,
  Lightbulb,
  Timeline,
  Refresh,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { simulateScore } from '../api/api';
import { motion } from 'framer-motion';

const ScoreSimulator = ({ currentData, currentScore }) => {
  const [hypotheticalChanges, setHypotheticalChanges] = useState({});
  const [projectedScore, setProjectedScore] = useState(null);
  const [scoreChange, setScoreChange] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Chart data for score journey visualization
  const [chartData, setChartData] = useState([]);
  
  // Reset function
  const resetSimulation = () => {
    setHypotheticalChanges({});
    setProjectedScore(null);
    setScoreChange(0);
    setExplanation('');
    setError(null);
    setChartData([]);
  };
  
  // Helper function to convert employment type to numeric
  const convertEmploymentType = (empType) => {
    if (typeof empType === 'number') return empType;
    const mapping = { 'unemployed': 0, 'self_employed': 1, 'salaried': 2, 'business_owner': 3 };
    return mapping[empType] || 0;
  };

  // Helper function to prepare data for ML model
  const prepareDataForBackend = (data) => {
    return {
      loan_repayment_status: data.loan_repayment_status ?? 0,
      loan_tenure_months: data.loan_tenure_months ?? 12,
      electricity_bill_paid_on_time: data.electricity_bill_paid_on_time ?? 0,
      mobile_recharge_frequency: data.mobile_recharge_frequency ?? 1,
      is_high_need: data.is_high_need ? 1 : 0,
      age: data.age ?? 30,
      monthly_income: data.monthly_income ?? 0,
      employment_type: convertEmploymentType(data.employment_type)
    };
  };

  // Handle simulation
  const handleSimulate = async () => {
    if (!currentData || Object.keys(hypotheticalChanges).length === 0) {
      setError('Please make at least one change to simulate');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Prepare data for backend (convert employment_type string to number, etc.)
      const preparedCurrentData = prepareDataForBackend(currentData);
      const preparedChanges = {};
      
      // Only include changed values that are different from current
      Object.keys(hypotheticalChanges).forEach(key => {
        if (key === 'employment_type') {
          preparedChanges[key] = convertEmploymentType(hypotheticalChanges[key]);
        } else {
          preparedChanges[key] = hypotheticalChanges[key];
        }
      });
      
      // Debug: Log the data being sent to backend
      console.log('Sending to backend:', {
        current_data: preparedCurrentData,
        hypothetical_changes: preparedChanges
      });
      
      const result = await simulateScore(preparedCurrentData, preparedChanges);
      
      console.log('Backend simulation result:', result);
      
      setProjectedScore(result.projected_score);
      setScoreChange(result.score_change);
      setExplanation(result.explanation);
      
      // Create chart data for visualization
      const chartData = [
        { month: 'Current', score: currentScore, label: 'Current Score' },
        { month: 'Projected', score: result.projected_score, label: 'Projected Score' },
      ];
      setChartData(chartData);
      
    } catch (err) {
      console.error('Backend simulation failed:', err.message);
      
      // Check if it's a connection issue
      if (err.message.includes('No response from server') || err.message.includes('Network Error')) {
        setError(`Backend server not responding. Please ensure the backend server is running on http://localhost:8000`);
      } else {
        // For other errors, try local fallback but show a warning
        console.warn('Using local fallback calculation');
        const localResult = simulateScoreLocally(currentData, hypotheticalChanges);
        
        setProjectedScore(localResult.projected_score);
        setScoreChange(localResult.score_change);
        setExplanation(`⚠️ Using simplified calculation (backend unavailable): ${localResult.explanation}`);
        
        // Create chart data for visualization
        const chartData = [
          { month: 'Current', score: currentScore, label: 'Current Score' },
          { month: 'Projected', score: localResult.projected_score, label: 'Projected Score' },
        ];
        setChartData(chartData);
      }
    } finally {
      setLoading(false);
    }
  };

  // Local simulation fallback function
  const simulateScoreLocally = (current, changes) => {
    let baseScore = currentScore || 650;
    let scoreAdjustment = 0;
    
    // Simple scoring logic based on changes
    Object.entries(changes).forEach(([key, value]) => {
      switch (key) {
        case 'monthly_income':
          const incomeChange = (value - (current.monthly_income || 0)) / 1000;
          scoreAdjustment += Math.min(incomeChange * 2, 50); // Max 50 points for income
          break;
        case 'employment_type':
          if (value > (current.employment_type || 0)) scoreAdjustment += 25;
          if (value < (current.employment_type || 0)) scoreAdjustment -= 15;
          break;
        case 'loan_repayment_status':
          if (value > (current.loan_repayment_status || 0)) scoreAdjustment += 40;
          if (value < (current.loan_repayment_status || 0)) scoreAdjustment -= 40;
          break;
        case 'electricity_bill_paid_on_time':
          if (value > (current.electricity_bill_paid_on_time || 0)) scoreAdjustment += 30;
          if (value < (current.electricity_bill_paid_on_time || 0)) scoreAdjustment -= 30;
          break;
        case 'mobile_recharge_frequency':
          if (value > (current.mobile_recharge_frequency || 0)) scoreAdjustment += 15;
          if (value < (current.mobile_recharge_frequency || 0)) scoreAdjustment -= 10;
          break;
        case 'loan_tenure_months':
          const tenureChange = value - (current.loan_tenure_months || 12);
          if (tenureChange < 0) scoreAdjustment += 10; // Shorter tenure is better
          if (tenureChange > 0) scoreAdjustment -= 5; // Longer tenure is slightly worse
          break;
        default:
          break;
      }
    });
    
    const projectedScore = Math.max(300, Math.min(850, baseScore + scoreAdjustment));
    
    // Generate explanation
    let explanation = "Local simulation based on your changes: ";
    if (scoreAdjustment > 0) {
      explanation += `These improvements could increase your score by approximately ${Math.round(scoreAdjustment)} points. `;
    } else if (scoreAdjustment < 0) {
      explanation += `These changes might decrease your score by approximately ${Math.round(Math.abs(scoreAdjustment))} points. `;
    } else {
      explanation += "These changes would have minimal impact on your current score. ";
    }
    
    explanation += "This is a simplified calculation. For more accurate projections, ensure the backend server is running.";
    
    return {
      projected_score: Math.round(projectedScore),
      score_change: Math.round(scoreAdjustment),
      explanation: explanation
    };
  };
  
  // Handle parameter changes with proper type validation
  const handleParameterChange = (parameter, value) => {
    // Ensure value is properly typed
    let typedValue = value;
    
    // Convert to appropriate types based on parameter
    if (['loan_repayment_status', 'electricity_bill_paid_on_time', 'is_high_need', 'employment_type'].includes(parameter)) {
      typedValue = parseInt(value, 10);
    } else if (['mobile_recharge_frequency', 'age', 'monthly_income'].includes(parameter)) {
      typedValue = parseInt(value, 10);
    }
    
    // Validate ranges
    if (parameter === 'mobile_recharge_frequency' && (typedValue < 1 || typedValue > 4)) {
      setError('Mobile recharge frequency must be between 1 and 4');
      return;
    }
    
    if (parameter === 'monthly_income' && typedValue < 0) {
      setError('Monthly income must be positive');
      return;
    }
    
    if (parameter === 'age' && (typedValue < 18 || typedValue > 65)) {
      setError('Age must be between 18 and 65');
      return;
    }
    
    setError(null); // Clear any previous errors
    setHypotheticalChanges(prev => ({
      ...prev,
      [parameter]: typedValue,
    }));
  };
  
  // Get improvement suggestions with better default handling
  const getImprovementSuggestions = () => {
    if (!currentData) return [];
    
    const suggestions = [];
    
    // Use safe access with proper defaults
    const loanRepaymentStatus = currentData.loan_repayment_status ?? 0;
    const electricityBillStatus = currentData.electricity_bill_paid_on_time ?? 0;
    const mobileRechargeFreq = currentData.mobile_recharge_frequency ?? 1;
    const employmentType = currentData.employment_type ?? 0;
    
    if (loanRepaymentStatus === 0) {
      suggestions.push({
        parameter: 'loan_repayment_status',
        value: 1,
        title: 'Improve Loan Repayment',
        description: 'Make all future loan payments on time',
        impact: 'High',
      });
    }
    
    if (electricityBillStatus === 0) {
      suggestions.push({
        parameter: 'electricity_bill_paid_on_time',
        value: 1,
        title: 'Pay Utility Bills On Time',
        description: 'Set up automatic bill payments',
        impact: 'Medium',
      });
    }
    
    if (mobileRechargeFreq < 3) {
      suggestions.push({
        parameter: 'mobile_recharge_frequency',
        value: 4,
        title: 'Increase Mobile Recharge Frequency',
        description: 'Recharge more regularly to show stable income',
        impact: 'Low',
      });
    }
    
    if (employmentType === 0) {
      suggestions.push({
        parameter: 'employment_type',
        value: 2,
        title: 'Secure Stable Employment',
        description: 'Find salaried employment for better creditworthiness',
        impact: 'High',
      });
    }
    
    return suggestions.slice(0, 3); // Return top 3 suggestions
  };
  
  const improvementSuggestions = getImprovementSuggestions();
  
  // Apply suggestion
  const applySuggestion = (suggestion) => {
    handleParameterChange(suggestion.parameter, suggestion.value);
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
          <Calculate sx={{ color: 'white', fontSize: 24 }} />
        </Box>
        <Typography variant="h6" color="primary" fontWeight="bold">
          IncluScore Simulator
        </Typography>
      </Box>
      
      <Typography variant="body2" color="textSecondary" paragraph textAlign="center">
        See how future positive actions can improve your credit score
      </Typography>
      
      <Divider sx={{ mb: 3, opacity: 0.3 }} />
      
      {/* Quick Improvement Suggestions */}
      {improvementSuggestions.length > 0 && (
        <Box mb={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Lightbulb sx={{ color: 'warning.main', fontSize: 20 }} />
            <Typography variant="subtitle2" fontWeight="bold">
              Quick Suggestions
            </Typography>
          </Box>
          
          <Grid container spacing={1.5}>
            {improvementSuggestions.map((suggestion, index) => (
              <Grid item xs={12} key={index}>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      background: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateX(8px)',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                        borderColor: 'primary.main',
                      }
                    }} 
                    onClick={() => applySuggestion(suggestion)}
                  >
                    <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box flex={1}>
                          <Typography variant="body2" fontWeight="bold">
                            {suggestion.title}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {suggestion.description}
                          </Typography>
                        </Box>
                        <Chip
                          label={suggestion.impact}
                          size="small"
                          sx={{
                            bgcolor: suggestion.impact === 'High' 
                              ? 'rgba(244, 67, 54, 0.1)' 
                              : suggestion.impact === 'Medium' 
                              ? 'rgba(255, 152, 0, 0.1)' 
                              : 'rgba(76, 175, 80, 0.1)',
                            color: suggestion.impact === 'High' 
                              ? 'error.main' 
                              : suggestion.impact === 'Medium' 
                              ? 'warning.main' 
                              : 'success.main',
                            fontWeight: 700,
                            border: `1px solid ${suggestion.impact === 'High' 
                              ? 'rgba(244, 67, 54, 0.3)' 
                              : suggestion.impact === 'Medium' 
                              ? 'rgba(255, 152, 0, 0.3)' 
                              : 'rgba(76, 175, 80, 0.3)'}`,
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      
      {/* Simulation Parameters */}
      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
        Simulate Changes
      </Typography>
      
      <Grid container spacing={2} mb={3}>
        {/* Loan Repayment Status */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Loan Repayment Status</InputLabel>
            <Select
              value={hypotheticalChanges.loan_repayment_status !== undefined 
                ? hypotheticalChanges.loan_repayment_status 
                : (currentData?.loan_repayment_status ?? 0)}
              label="Loan Repayment Status"
              onChange={(e) => handleParameterChange('loan_repayment_status', e.target.value)}
            >
              <MenuItem value={0}>Default/Late Payments</MenuItem>
              <MenuItem value={1}>On-Time Payments</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        {/* Electricity Bill Payment */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Utility Bill Payments</InputLabel>
            <Select
              value={hypotheticalChanges.electricity_bill_paid_on_time !== undefined 
                ? hypotheticalChanges.electricity_bill_paid_on_time 
                : (currentData?.electricity_bill_paid_on_time ?? 0)}
              label="Utility Bill Payments"
              onChange={(e) => handleParameterChange('electricity_bill_paid_on_time', e.target.value)}
            >
              <MenuItem value={0}>Late/Missed Payments</MenuItem>
              <MenuItem value={1}>On-Time Payments</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        {/* Mobile Recharge Frequency */}
        <Grid item xs={12}>
          <Typography variant="body2" gutterBottom>
            Mobile Recharge Frequency: {hypotheticalChanges.mobile_recharge_frequency !== undefined 
              ? hypotheticalChanges.mobile_recharge_frequency 
              : (currentData?.mobile_recharge_frequency ?? 1)} times/month
          </Typography>
          <Slider
            value={hypotheticalChanges.mobile_recharge_frequency !== undefined 
              ? hypotheticalChanges.mobile_recharge_frequency 
              : (currentData?.mobile_recharge_frequency ?? 1)}
            min={1}
            max={4}
            step={1}
            marks={[
              { value: 1, label: '1' },
              { value: 2, label: '2' },
              { value: 3, label: '3' },
              { value: 4, label: '4' },
            ]}
            onChange={(e, value) => handleParameterChange('mobile_recharge_frequency', value)}
          />
        </Grid>
        
        {/* Employment Type */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Employment Type</InputLabel>
            <Select
              value={hypotheticalChanges.employment_type !== undefined 
                ? hypotheticalChanges.employment_type 
                : (currentData?.employment_type ?? 0)}
              label="Employment Type"
              onChange={(e) => handleParameterChange('employment_type', e.target.value)}
            >
              <MenuItem value={0}>Unemployed</MenuItem>
              <MenuItem value={1}>Self-employed</MenuItem>
              <MenuItem value={2}>Salaried</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        {/* Monthly Income */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Monthly Income</InputLabel>
            <Select
              value={hypotheticalChanges.monthly_income !== undefined 
                ? hypotheticalChanges.monthly_income 
                : (currentData?.monthly_income ?? 5000)}
              label="Monthly Income"
              onChange={(e) => handleParameterChange('monthly_income', e.target.value)}
            >
              <MenuItem value={5000}>₹5,000</MenuItem>
              <MenuItem value={8000}>₹8,000</MenuItem>
              <MenuItem value={12000}>₹12,000</MenuItem>
              <MenuItem value={15000}>₹15,000</MenuItem>
              <MenuItem value={20000}>₹20,000</MenuItem>
              <MenuItem value={25000}>₹25,000</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      
      {/* Action Buttons */}
      <Box display="flex" gap={2} mb={3}>
        <Button
          variant="contained"
          onClick={handleSimulate}
          disabled={loading || Object.keys(hypotheticalChanges).length === 0}
          startIcon={loading ? <CircularProgress size={20} /> : <TrendingUp />}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderRadius: '12px',
            textTransform: 'none',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5568d3 0%, #653a8b 100%)',
              boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
            },
            '&:disabled': {
              background: 'rgba(0, 0, 0, 0.12)',
            }
          }}
        >
          {loading ? 'Simulating...' : 'Simulate New Score'}
        </Button>
        
        <Button
          variant="outlined"
          onClick={resetSimulation}
          disabled={loading}
          startIcon={<Refresh />}
          sx={{
            borderColor: 'rgba(102, 126, 234, 0.5)',
            color: 'primary.main',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderRadius: '12px',
            textTransform: 'none',
            '&:hover': {
              borderColor: 'primary.main',
              background: 'rgba(102, 126, 234, 0.05)',
            }
          }}
        >
          Reset
        </Button>
      </Box>
      
      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              borderRadius: '12px',
              border: '1px solid rgba(244, 67, 54, 0.3)',
            }}
          >
            {error}
          </Alert>
        </motion.div>
      )}
      
      {/* Results Display */}
      {projectedScore !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Box>
            <Divider sx={{ mb: 3, opacity: 0.3 }} />
            
            {/* Score Change Summary */}
            <Grid container spacing={2} mb={3}>
              <Grid item xs={4}>
                <Box 
                  textAlign="center" 
                  p={2.5}
                  sx={{
                    background: 'rgba(102, 126, 234, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                  }}
                >
                  <Typography variant="h5" fontWeight="bold" color="text.primary">
                    {currentScore}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" fontWeight={600}>
                    Current Score
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={4}>
                <Box 
                  textAlign="center" 
                  p={2.5}
                  sx={{
                    background: scoreChange >= 0 
                      ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)'
                      : 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%)',
                    borderRadius: '12px',
                    border: scoreChange >= 0 
                      ? '1px solid rgba(76, 175, 80, 0.3)'
                      : '1px solid rgba(244, 67, 54, 0.3)',
                  }}
                >
                  <Typography 
                    variant="h5" 
                    fontWeight="bold" 
                    color={scoreChange >= 0 ? 'success.main' : 'error.main'}
                  >
                    {scoreChange >= 0 ? '+' : ''}{scoreChange}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" fontWeight={600}>
                    Score Change
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={4}>
                <Box 
                  textAlign="center" 
                  p={2.5}
                  sx={{
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                    borderRadius: '12px',
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                  }}
                >
                  <Typography 
                    variant="h5" 
                    fontWeight="bold"
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {projectedScore}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" fontWeight={600}>
                    Projected Score
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            {/* Score Journey Chart */}
            {chartData.length > 0 && (
              <Box 
                mb={3}
                p={2.5}
                sx={{
                  background: 'rgba(255, 255, 255, 0.5)',
                  borderRadius: '12px',
                  border: '1px solid rgba(102, 126, 234, 0.1)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Timeline sx={{ color: 'primary.main' }} />
                  <Typography variant="subtitle2" fontWeight="bold">
                    Score Journey
                  </Typography>
                </Box>
                
                <Box height={200}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(102, 126, 234, 0.2)" />
                      <XAxis 
                        dataKey="month"
                        stroke="#667eea"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis 
                        domain={[300, 900]}
                        stroke="#667eea"
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid rgba(102, 126, 234, 0.3)',
                          borderRadius: '8px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="url(#scoreGradient)"
                        strokeWidth={3}
                        dot={{ fill: '#667eea', strokeWidth: 2, r: 6 }}
                      />
                      <defs>
                        <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#667eea" />
                          <stop offset="100%" stopColor="#764ba2" />
                        </linearGradient>
                      </defs>
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
            )}
            
            {/* AI Explanation */}
            {explanation && (
              <Box
                p={2.5}
                sx={{
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                  borderRadius: '12px',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary">
                  🤖 AI Analysis
                </Typography>
                <Typography variant="body2" lineHeight={1.7} color="text.secondary">
                  {explanation}
                </Typography>
              </Box>
            )}
          </Box>
        </motion.div>
      )}
    </Paper>
  );
};

export default ScoreSimulator;