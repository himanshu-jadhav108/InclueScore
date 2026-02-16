/**
 * ScoreGauge Component for IncluScore
 * Displays the IncluScore credit score in an interactive gauge format
 */

import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const ScoreGauge = ({ score, maxScore = 900, minScore = 300 }) => {
  
  // Normalize score to percentage
  const normalizedScore = ((score - minScore) / (maxScore - minScore)) * 100;
  
  // Create data for the gauge
  const gaugeFillPercentage = Math.min(100, Math.max(0, normalizedScore));
  const gaugeEmptyPercentage = 100 - gaugeFillPercentage;
  
  const gaugeData = [
    { name: 'score', value: gaugeFillPercentage },
    { name: 'empty', value: gaugeEmptyPercentage },
  ];
  
  // Determine color based on score
  const getScoreColor = (score) => {
    if (score >= 750) return '#4caf50'; // Green
    if (score >= 650) return '#8bc34a'; // Light Green
    if (score >= 550) return '#ff9800'; // Orange
    if (score >= 450) return '#ff5722'; // Red Orange
    return '#f44336'; // Red
  };
  
  const getScoreLabel = (score) => {
    if (score >= 750) return 'Excellent';
    if (score >= 650) return 'Good';
    if (score >= 550) return 'Fair';
    if (score >= 450) return 'Poor';
    return 'Very Poor';
  };
  
  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);
  
  const COLORS = [scoreColor, 'rgba(224, 224, 224, 0.3)'];
  
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        textAlign: 'center', 
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
          <TrendingUpIcon sx={{ color: 'white', fontSize: 24 }} />
        </Box>
        <Typography variant="h6" color="primary" fontWeight="bold">
          IncluScore Credit Score
        </Typography>
      </Box>
      
      <Box position="relative" height={200} width="100%">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={gaugeData}
              cx="50%"
              cy="70%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={90}
              paddingAngle={0}
              dataKey="value"
              animationBegin={0}
              animationDuration={1000}
            >
              {gaugeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Score display in the center */}
        <Box
          position="absolute"
          top="60%"
          left="50%"
          sx={{
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.3 
            }}
          >
            <Typography
              variant="h3"
              component="div"
              fontWeight="bold"
              sx={{
                background: `linear-gradient(135deg, ${scoreColor} 0%, ${scoreColor}dd 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {score}
            </Typography>
          </motion.div>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
            out of {maxScore}
          </Typography>
        </Box>
      </Box>
      
      {/* Score label and description */}
      <Box mt={2}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Chip
            label={scoreLabel}
            sx={{
              bgcolor: `${scoreColor}20`,
              color: scoreColor,
              fontWeight: 700,
              fontSize: '1rem',
              height: 36,
              mb: 2,
              border: `2px solid ${scoreColor}40`,
            }}
          />
        </motion.div>

        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Your credit score is calculated based on multiple factors including
          loan repayment history, utility payments, and financial behavior.
        </Typography>
        
        {/* Score range indicator */}
        <Box 
          mt={2}
          sx={{
            p: 2,
            borderRadius: '12px',
            bgcolor: 'rgba(102, 126, 234, 0.05)',
            border: '1px solid rgba(102, 126, 234, 0.1)',
          }}
        >
          <Typography variant="caption" color="textSecondary" fontWeight={600}>
            Score Range: {minScore} - {maxScore}
          </Typography>
          
          {/* Visual score range bar */}
          <Box
            mt={2}
            height={10}
            borderRadius={5}
            bgcolor="rgba(224, 224, 224, 0.3)"
            position="relative"
            overflow="hidden"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${gaugeFillPercentage}%` }}
              transition={{ duration: 1, delay: 0.6 }}
              style={{ height: '100%' }}
            >
              <Box
                height="100%"
                borderRadius={5}
                sx={{
                  background: `linear-gradient(90deg, ${scoreColor} 0%, ${scoreColor}dd 100%)`,
                  boxShadow: `0 0 10px ${scoreColor}40`,
                }}
              />
            </motion.div>
          </Box>
          
          {/* Score benchmarks */}
          <Box
            display="flex"
            justifyContent="space-between"
            mt={1}
            px={1}
          >
            <Typography variant="caption" color="textSecondary">
              {minScore}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Poor
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Fair
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Good
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {maxScore}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default ScoreGauge;