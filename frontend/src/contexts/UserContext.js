/**
 * User Context for IncluScore
 * Manages user authentication, roles, and permissions with enhanced Clerk integration
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { getUserByClerkId, syncClerkUser } from '../api/api';

const UserContext = createContext();

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync Clerk user with database user
  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded) return;
      
      setLoading(true);
      setError(null);

      try {
        if (isSignedIn && user) {
          try {
            // Try to check if user exists in database
            const response = await getUserByClerkId(user.id);
            
            if (response.needs_registration) {
              // User doesn't exist, sync them
              const syncData = {
                clerk_user_id: user.id,
                email: user.primaryEmailAddress?.emailAddress,
                first_name: user.firstName || '',
                last_name: user.lastName || '',
              };

              await syncClerkUser(syncData);
              
              // Fetch the newly created user
              const newUserResponse = await getUserByClerkId(user.id);
              setDbUser(newUserResponse.user);
            } else {
              // User exists, use the data
              setDbUser(response.user);
            }
          } catch (apiError) {
            // If backend is not available or user sync fails, create a temporary user
            console.warn('Backend sync failed, using temporary user:', apiError.message);
            setDbUser({
              id: user.id,
              clerk_user_id: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              first_name: user.firstName || '',
              last_name: user.lastName || '',
              role: 'beneficiary', // Default role
              permissions: [],
              is_active: true,
              created_at: new Date().toISOString(),
              temp_user: true // Flag to indicate this is a temporary user
            });
          }
        } else {
          setDbUser(null);
        }
      } catch (err) {
        console.error('Error syncing user:', err);
        setError('Failed to sync user with database');
        setDbUser(null);
      } finally {
        setLoading(false);
      }
    };

    syncUser();
  }, [user, isLoaded, isSignedIn]);

  // Refresh user data from database
  const refreshUser = async () => {
    if (user?.id) {
      try {
        const response = await getUserByClerkId(user.id);
        setDbUser(response.user);
      } catch (err) {
        console.error('Error refreshing user data:', err);
      }
    }
  };

  // Role checking functions
  const hasRole = (role) => {
    return dbUser?.role === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(dbUser?.role);
  };

  const hasPermission = (permission) => {
    return dbUser?.permissions?.includes(permission) || false;
  };

  // Convenience role checker - only beneficiary
  const isBeneficiary = () => hasRole('beneficiary');

  // Permission checkers - simplified for beneficiary only
  const canViewOwnData = () => hasAnyRole(['beneficiary']) || hasPermission('view_own_profile');

  const value = {
    // User data
    clerkUser: user,
    dbUser,
    isLoaded,
    isSignedIn,
    loading,
    error,

    // Role checking functions
    hasRole,
    hasAnyRole,
    hasPermission,
    isBeneficiary,

    // Permission checking functions
    canViewOwnData,

    // Helper functions
    refreshUser,
    updateUserRole: (newRole) => {
      if (dbUser) {
        const updatedUser = { ...dbUser, role: newRole };
        setDbUser(updatedUser);
        
        // Also update localStorage for persistence
        localStorage.setItem('zenith_user_role', newRole);
      }
    },

    // Helper data
    userDisplayName: dbUser ? `${dbUser.first_name} ${dbUser.last_name}`.trim() : 
                     user?.fullName || user?.primaryEmailAddress?.emailAddress || 'User',
    userRole: dbUser?.role || 'guest',
    userEmail: dbUser?.email || user?.primaryEmailAddress?.emailAddress || '',
    isAuthenticated: isSignedIn && !!dbUser,
    permissions: dbUser?.permissions || []
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;