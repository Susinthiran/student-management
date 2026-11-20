import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sms_auth_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('sms_auth_token');
      if (token) {
        try {
          const res = await authService.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('sms_auth_user', JSON.stringify(res.user));
          }
        } catch (error) {
          console.warn('Authentication verify notice:', error.message);
          // Only clear if server explicitly rejected
          if (error.response?.status === 401) {
            setUser(null);
            localStorage.removeItem('sms_auth_token');
            localStorage.removeItem('sms_auth_user');
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateUserProfile = async (profileData) => {
    const res = await authService.updateProfile(profileData);
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
