/**
 * Role-Based Route Component for IncluScore
 * Redirects users to appropriate dashboards based on their roles
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';
import {
  Box,
  CircularProgress,
  Typography,
  Alert,
} from '@mui/material';

const RoleBasedRoute = ({ children, allowedRoles, fallbackPath = '/dashboard' }) => {
  const { loading, error, hasAnyRole, isSignedIn, isLoaded } = useUserContext();
  const location = useLocation();

  // Show loading while authentication is being determined
  if (!isLoaded || loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="grey.50"
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  // Redirect to login if not signed in
  if (!isSignedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Show error if there was a problem loading user data
  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="grey.50"
        p={3}
      >
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading user data: {error}
        </Alert>
        <Typography variant="body2">
          Please try refreshing the page or contact support.
        </Typography>
      </Box>
    );
  }

  // Check if user has required role
  if (allowedRoles && !hasAnyRole(allowedRoles)) {
    return <Navigate to={fallbackPath} replace />;
  }

  // User is authenticated and has the required role
  return children;
};

/**
 * Route component for beneficiaries
 */
export const BeneficiaryRoute = ({ children }) => {
  return (
    <RoleBasedRoute allowedRoles={['beneficiary']} fallbackPath="/beneficiary/dashboard">
      {children}
    </RoleBasedRoute>
  );
};

/**
 * Smart dashboard redirect - always redirects to beneficiary dashboard
 */
export const DashboardRedirect = () => {
  const { loading, isSignedIn, isLoaded } = useUserContext();

  if (!isLoaded || loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  // Always redirect to beneficiary dashboard
  return <Navigate to="/beneficiary/dashboard" replace />;
};

export default RoleBasedRoute;