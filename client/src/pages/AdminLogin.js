import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [userId, setUserId] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { login, changePassword } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const result = await login(email, password);
      
      if (result.mustChangePassword) {
        setMustChangePassword(true);
        setUserId(result.userId);
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.error || 'Login failed');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setPasswordError('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    try {
      await changePassword(userId, currentPassword, newPassword);
      navigate('/admin/dashboard');
    } catch (err) {
      setPasswordError(err.error || 'Password change failed');
    }
  };

  if (mustChangePassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold font-dinbek mb-6 text-reshow-dark">Change Password</h2>
          <p className="font-dosis text-gray-700 mb-6">
            You must change your password before continuing.
          </p>
          {passwordError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {passwordError}
            </div>
          )}
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block font-dosis font-semibold mb-2">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
              />
            </div>
            <div>
              <label className="block font-dosis font-semibold mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
              />
              <p className="text-xs font-dosis text-gray-500 mt-1">
                Min 8 chars, uppercase, lowercase, number, special character
              </p>
            </div>
            <div>
              <label className="block font-dosis font-semibold mb-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-reshow-red text-white py-3 rounded-lg font-dosis font-semibold hover:bg-reshow-dark-red transition-colors"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold font-dinbek mb-6 text-reshow-dark">Admin Login</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-dosis font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
            />
          </div>
          <div>
            <label className="block font-dosis font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-reshow-red font-dosis"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-reshow-red text-white py-3 rounded-lg font-dosis font-semibold hover:bg-reshow-dark-red transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

