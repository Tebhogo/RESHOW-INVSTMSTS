import React, { useContext, useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const lastActivityRef = useRef(Date.now());


  useEffect(() => {
    if (!user) return;

    // Activity tracking functions
    const updateActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const checkInactivity = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityRef.current;
      const oneMinute = 60 * 1000; // 1 minute in milliseconds

      if (timeSinceLastActivity >= oneMinute) {
        // Auto logout after 1 minute of inactivity
        logout();
        navigate('/admin/login', { replace: true });
        alert('You have been logged out due to inactivity.');
      }
    };

    // Track user activity events
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    // Check inactivity every 10 seconds
    const interval = setInterval(checkInactivity, 10000);

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
      clearInterval(interval);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [user, logout, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-reshow-dark">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

