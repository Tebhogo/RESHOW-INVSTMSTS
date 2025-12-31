import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const PasswordChangeModal = ({ isOpen, userId, onSuccess }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { changePassword } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
      return;
    }

    setLoading(true);
    try {
      await changePassword(userId, currentPassword, newPassword);
      onSuccess();
    } catch (err) {
      setError(err.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold font-dinbek text-reshow-dark mb-2">Change Password</h2>
          <p className="text-sm font-dosis text-gray-600">
            You must change your default password to continue.
          </p>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
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
              Must be 8+ characters with uppercase, lowercase, number, and special character
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
            disabled={loading}
            className="w-full bg-reshow-red text-white py-3 rounded-lg font-dosis font-semibold hover:bg-reshow-dark-red transition-colors disabled:opacity-50"
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeModal;

