import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    // Check if we're on an admin route
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    
    if (isAdminRoute) {
      // For admin routes, use sessionStorage instead of localStorage
      // This ensures credentials are cleared when browser tab is closed
      // Check sessionStorage for token (not localStorage)
      const token = sessionStorage.getItem('adminToken');
      const savedUser = sessionStorage.getItem('adminUser');

      if (token && savedUser) {
        try {
          const user = JSON.parse(savedUser);
          setUser(user);
          // Set token in axios defaults for API calls
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (e) {
          sessionStorage.removeItem('adminToken');
          sessionStorage.removeItem('adminUser');
          if (isMounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }
        
        // Verify token is still valid
        api.get('/auth/me')
          .then(res => {
            if (isMounted) {
              setUser(res.data);
            }
          })
          .catch((error) => {
            if (error.response?.status === 401) {
              sessionStorage.removeItem('adminToken');
              sessionStorage.removeItem('adminUser');
            }
            if (isMounted) {
              setUser(null);
            }
          })
          .finally(() => {
            if (isMounted) {
              setLoading(false);
            }
          });
      } else {
        // No session - require login
        // Clear any old localStorage tokens
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
      }
    } else {
      // Non-admin routes - no auto-restore needed
      if (isMounted) {
        setUser(null);
        setLoading(false);
      }
    }
    
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      
      if (res.data.mustChangePassword) {
        return { mustChangePassword: true, userId: res.data.userId };
      }

      // Use sessionStorage for admin sessions (clears when tab closes)
      sessionStorage.setItem('adminToken', res.data.token);
      sessionStorage.setItem('adminUser', JSON.stringify(res.data.user));
      // Also clear localStorage to ensure no persistence
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Set token in axios defaults
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
      return { success: true, user: res.data.user };
    } catch (error) {
      throw error.response?.data || { error: 'Login failed' };
    }
  };

  const changePassword = async (userId, currentPassword, newPassword) => {
    try {
      const res = await api.post('/auth/change-password', {
        userId,
        currentPassword,
        newPassword
      });

      // Use sessionStorage for admin sessions
      sessionStorage.setItem('adminToken', res.data.token);
      sessionStorage.setItem('adminUser', JSON.stringify(res.data.user));
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Set token in axios defaults
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
      return { success: true, user: res.data.user };
    } catch (error) {
      throw error.response?.data || { error: 'Password change failed' };
    }
  };

  const logout = () => {
    // Clear all authentication data (both sessionStorage and localStorage)
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminUser');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    // Force redirect to login page
    window.location.href = '/admin/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, changePassword, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

